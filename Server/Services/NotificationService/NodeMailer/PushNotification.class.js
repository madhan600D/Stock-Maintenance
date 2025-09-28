import nodemailer from 'nodemailer'
import { ImportEmailHTML } from "./MailTemplate.js"
import {transporter} from './Notification.config.js' 
import {ENV_VerificationEndpoint , ObjPublicConfigVariables} from '../Declarations/Declarations.js'
import {objNotificationDB} from "../Utils/NotificationDB.js";
import {ObjNotificationKafkaProducer} from '../Kafka/Producer/KafkaProducer.js'
import {Op} from 'sequelize'
export class PushMail{
    constructor(mailOptions){
        //{ParentMailOptions:{UserName,UserMail , HTML}}
        this.ParentMailOptions = mailOptions
        this.UserData
        this.NotificationData
        this.ErrorObj = {success:true , message:""}
    }
SendMail = async (transaction) => {
    try {
        this.UserData = await objNotificationDB.Users.findOne({where:{UserMail:this.ParentMailOptions.to}});
        if(!this.UserData){
            return {success:false}
        }
        await this.IsUserAtCoolDown(this.ParentMailOptions.UserName , transaction);
        let KafkaResponse = {}
        if (!this.ErrorObj.success) {
            // TBD: Kafka response as userName is at CoolDown 
            // KafkaResponse.Event = "UserInCooldown"
            // KafkaResponse.Data = {Success:false , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            // ObjNotificationKafkaProducer.ProduceEvent('UserInCooldown' , 'user.create_user.response' ,KafkaResponse )
            return { success: false, message:  "User cool down validation failed" };
        }

        const IsSameContextMailSent = await objNotificationDB.Notifications.findOne({
            where: {
                [Op.and]: [
                    { ReceiverID: this.UserData.UserID }, 
                    { Subject: this.ParentMailOptions.subject }
                ]
            } , transaction:transaction
        });

        if (IsSameContextMailSent) {
            // const IsMailDelivered = await objNotificationDB.NotificationDeliveryStatus.findOne({ ... })
            this.NotificationData = IsSameContextMailSent;
        } else {
            const NotificationData = await objNotificationDB.Notifications.create({
                Subject: this.ParentMailOptions.subject,
                Body: this.ParentMailOptions.text ? this.ParentMailOptions.text : '<html>',
                ReceiverID: this.UserData.UserID
            } , {transaction:transaction});

            const NotificationStatusData = await objNotificationDB.NotificationDeliveryStatus.create({
                NotificationID: NotificationData.NotificationID,
                Sender: "Push Notification Service",
                ReceiverID: this.UserData.UserID,
                DeliveryStatus: 'Pending'
            } , {transaction:transaction});

            this.NotificationData = NotificationData;
        }

        // Push Mail
        const info = await transporter.sendMail(this.ParentMailOptions);
        // Development phase logs
        console.log('Message sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        // Mail Sent
        let DeliveryStatus;
        if (info) {
            DeliveryStatus = await objNotificationDB.NotificationDeliveryStatus.update(
                { DeliveryStatus: 'Sent' },
                { where: { NotificationID: this.NotificationData.NotificationID } , transaction:transaction},
            );
            KafkaResponse = {}
            // KafkaResponse.Event = 'VerificationMailSent'
            // KafkaResponse.Data = {Success : true , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            // ObjNotificationKafkaProducer.ProduceEvent('VerificationMailSent' , 'user.create_user.response' , )
            await this.AddMailToBucket(this.UserData.UserName , transaction);
            return {success:true , message:"Mail added to bucket...!"}
        } else {
            // KafkaResponse = {}
            // KafkaResponse.Event = 'VerificationMailSent'
            // KafkaResponse.Data = {Success : false , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            // ObjNotificationKafkaProducer.ProduceEvent('VerificationMailSent' , 'user.create_user.response' , )
            DeliveryStatus = await objNotificationDB.NotificationDeliveryStatus.update(
                { DeliveryStatus: 'Failed' },
                { where: { NotificationID: this.NotificationData.NotificationID } , transaction:transaction }
            );
            this.ErrorObj.success = false;
            return {success:false , message:"Mail failed...!"}
        }
    } catch (error) {
        this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
        await transaction.rollback()
        console.log("Error at Push mail" , error)
    }
};
    IsUserAtCoolDown = async (UserName ,transaction) => {
        try {
            let CurrentTime = this.ConvertToDateTimeFormat(new Date().toISOString())
            const IsValidUser = await objNotificationDB.Users.findOne({where:{UserName:UserName} , transaction:transaction})
            if(!IsValidUser ){
                 return {success:false , message:"Invalid User"}
            }
            if(IsValidUser){
                this.UserData = IsValidUser
            }
            else{
                return {success:false , message:"Invalid user ...!"}
            }
            const IsCoolDown = await objNotificationDB.NotificationCoolDown.findOne(
                {
                    where:{UserName:UserName},transaction:transaction
                }
            )
            if(IsCoolDown.IsCoolDown === true){
                this.ErrorObj.success = false
                return 
            }
            const IsBucketOverFlow = await objNotificationDB.NotificationBuckets.findOne(
                    {include: 
                    [{
                        model: objNotificationDB.Users,
                        attributes: ['UserName'] 
                    }]},
                    {where:{UserName:UserName} , transaction}
                )
            if(!IsBucketOverFlow){
                //Create a bucket If not bucket is available: (First Mail to Receipient)
                const CreatedBucket = await objNotificationDB.NotificationBuckets.create(
                    {
                        UserID:IsValidUser.UserID,
                        BucketCreatedTime:CurrentTime,
                        NotificationsInBucket:0,
                    } , {transaction: transaction}
                )
                return {success:true}
            }
            //Calculate time differnece between Mail Bucket Created Time and now
            const BucketTimeWindow = this.CalculateBucketTimeDifference(this.ConvertToDateTimeFormat(IsBucketOverFlow.BucketCreatedTime.toISOString()) , CurrentTime)
            if (BucketTimeWindow <= ObjPublicConfigVariables.MailBucketCoolDownTime &&
                IsBucketOverFlow.NotificationsInBucket >= ObjPublicConfigVariables.MailBucketLimit){
                    await objNotificationDB.NotificationCoolDown.update(
                        {IsCoolDown:true} , 
                        {where:{userName:UserName}} , {transaction:transaction}
                    )
                    this.ErrorObj.success = false
                    return {success:false , message:"User is in CoolDown ....!"} 
                }
            else if (BucketTimeWindow >= ObjPublicConfigVariables.MailBucketCoolDownTime){
                //Clear and Create New Bucket
                const ToClear = await objNotificationDB.NotificationBuckets.findAll(
                    {include: 
                    [{
                        model: objNotificationDB.Users,
                        attributes: ['UserName'] 
                    }]},
                    {where:{UserName:UserName} , transaction:transaction}
                )
                //Clear old buckets
                for (const Bucket of ToClear) {
                    await Bucket.destroy();
                }
                await objNotificationDB.NotificationBuckets.create({
                    UserID:this.UserData.UserID,
                    BucketCreatedTime:CurrentTime,
                    NotificationsInBucket:0
                } , {transaction:transaction})
                await objNotificationDB.NotificationCoolDown.update({IsCoolDown:false} , {where:{userName:UserName} , transaction:transaction})
            }
        } catch (error) {
            await transaction.rollback()
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
    AddMailToBucket = async (UserName , transaction) => {
        try {
            let NotificationCount = await objNotificationDB.NotificationBuckets.findOne({where:{UserID:this.UserData.UserID} , transaction:transaction})
            NotificationCount.NotificationsInBucket += 1
            await objNotificationDB.NotificationBuckets.update({NotificationsInBucket:NotificationCount.NotificationsInBucket} , {where:{UserID:this.UserData.UserID} , transaction:transaction})

        } catch (error) {
            await transaction.rollback()
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
    CalculateBucketTimeDifference =   (BucketCreatedTime , CurrentTime) => {
        try {// Convert to ISO format
        let diffInMs = CurrentTime - BucketCreatedTime
        const diffInMinutes = diffInMs / (1000 * 60);
        return diffInMinutes;
        } catch (error) {
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
    ConvertToDateTimeFormat = (Param) =>{
        try {
            //Convert to SQL server DateTime Format
            // const FormattedCurrentTime = Param.toISOString().slice(0, 19).replace('T', ' '); 
            // return FormattedCurrentTime
            let Parsed = new Date(Param)
            return Parsed
        } catch (error) {
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
}
export class EmailVerification extends PushMail{
    constructor(UserMail , UserName) {
        super({})
        this.ParentMailOptions.to = UserMail
        this.ParentMailOptions.UserName = UserName
        this.ErrorObj = {success:true , message:""}
    }

    SendEmailVerification = async (reqID , TypeOfHTML , transaction) => {
        try {
            await this.PrepareHTML(reqID , TypeOfHTML)
            if (!this.ErrorObj.success) {
                console.log("Error at EmailVerification class")
                return {success:false , message:"Cannot prepare HTML"}
            }
           const IsMailSent = await this.SendMail(transaction)
           if(IsMailSent?.success){
            return {success:true}
           } 
           else{
            return {success:false}
           }
            
        }
        catch (error) {
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
    PrepareHTML = async (reqID , TypeOfHTML) => {
        try {
            let VerificationEmailHTML  = await ImportEmailHTML(TypeOfHTML)
            VerificationEmailHTML = VerificationEmailHTML.replace('{user}' , this.ParentMailOptions.to.toString().toUpperCase())
            VerificationEmailHTML = VerificationEmailHTML.replace('{Verification_API}', ENV_VerificationEndpoint.concat(`/?reqID=${reqID}`))
            this.ParentMailOptions.subject = 'Email Verification'
            this.ParentMailOptions.html = VerificationEmailHTML
            return {success:true , message:'Verification Email Done'}
        } catch (error) {
            this.ErrorObj = {success:false , message:"System error in push mail" + error.message};
            console.log("Error at Push mail" , error)
            
        }
    }

    UserValidation = async () => {
        try {
            
        } catch (error) {
            this.ErrorObj = {success:false , message:"System error in user validation" + error.message};
            console.log("Error at Push mail" , error)
        }
    }
    
}


//Testing
const DemoMailOption = 
{
  from: '"My App" <maddison53@ethereal.email>',
  to: 'recipient@example.com',
  subject: '',
  text: '',
  html: ''
};

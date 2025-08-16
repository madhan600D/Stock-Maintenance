import nodemailer from 'nodemailer'
import { ImportEmailHTML } from "./MailTemplate.js"
import {transporter} from './Notification.config.js' 
import {ENV_VerificationEndpoint , ObjPublicConfigVariables} from '../Declarations/Declarations.js'
import {objNotificationDB} from "../Utils/NotificationDB.js";
import {ObjNotificationKafkaProducer} from '../Kafka/Producer/KafkaProducer.js'
import {Op} from 'sequelize'
export class PushMail{
    constructor(mailOptions){
        //Single Mail
        if(!Array.isArray(mailOptions)){
            this.ParentMailOptions = mailOptions
        }
        //Group Mail
        else{
            //Array Of objects
            for (const Email of mailOptions){
                this.ParentMailOptions.push(Email)
            }
        }
        
        this.UserData
        this.NotificationData
    }
SendMail = async () => {
    try {
        const result = await this.IsUserAtCoolDown(this.ParentMailOptions.UserName);
        let KafkaResponse = {}
        if (result.success === false) {
            // TBD: Kafka response as userName is at CoolDown 
            KafkaResponse.Event = UserInCooldown
            KafkaResponse.Data = {Success:false , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            ObjNotificationKafkaProducer.ProduceEvent('UserInCooldown' , 'user.create_user.response' ,KafkaResponse )
            return { success: false, message: result?.message ? result.message : "User cool down validation failed." };
        }

        const IsSameContextMailSent = await objNotificationDB.Notifications.findOne({
            where: {
                [Op.and]: [
                    { ReceiverID: this.UserData.UserID },
                    { Subject: this.ParentMailOptions.subject }
                ]
            }
        });

        if (IsSameContextMailSent) {
            // const IsMailDelivered = await objNotificationDB.NotificationDeliveryStatus.findOne({ ... })
            this.NotificationData = IsSameContextMailSent;
        } else {
            const NotificationData = await objNotificationDB.Notifications.create({
                Subject: this.ParentMailOptions.subject,
                Body: this.ParentMailOptions.text ? this.ParentMailOptions.text : '<html>',
                ReceiverID: this.UserData.UserID
            });

            const NotificationStatusData = await objNotificationDB.NotificationDeliveryStatus.create({
                NotificationID: NotificationData.NotificationID,
                Sender: "Push Notification Service",
                ReceiverID: this.UserData.UserID,
                DeliveryStatus: 'Pending'
            });

            this.NotificationData = NotificationData;
        }

        // Push Mail
        const info = await transporter.sendMail(this.ParentMailOptions);

        // Mail Sent
        let DeliveryStatus;
        if (info) {
            DeliveryStatus = await objNotificationDB.NotificationDeliveryStatus.update(
                { DeliveryStatus: 'Sent' },
                { where: { NotificationID: this.NotificationData.NotificationID } }
            );
            KafkaResponse = {}
            KafkaResponse.Event = 'VerificationMailSent'
            KafkaResponse.Data = {Success : true , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            ObjNotificationKafkaProducer.ProduceEvent('VerificationMailSent' , 'user.create_user.response' , )
            await this.AddMailToBucket(this.UserData.UserName);
        } else {
            KafkaResponse = {}
            KafkaResponse.Event = 'VerificationMailSent'
            KafkaResponse.Data = {Success : false , UserID : this.UserData.UserID , UserName : this.UserData.UserName , UserMail:this.UserData.UserMail}
            ObjNotificationKafkaProducer.ProduceEvent('VerificationMailSent' , 'user.create_user.response' , )
            DeliveryStatus = await objNotificationDB.NotificationDeliveryStatus.update(
                { DeliveryStatus: 'Failed' },
                { where: { NotificationID: this.NotificationData.NotificationID } }
            );
        }

        // Development phase logs
        console.log('Message sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

        if (info?.messageId) {
            // TBD: Kafka response as Success
            return { success: true, message: "Mail Sent!" };
        } else {
            return { success: false, message: "Mail Failed!" };
        }

    } catch (error) {
        console.error("Error in SendMail:", error);
        throw error;
    }
};
    GroupMail = async() => {
        //Push groupMail

    }
    IsUserAtCoolDown = async (UserName) => {
        try {
            let CurrentTime = this.ConvertToDateTimeFormat(new Date())
            

            const isValidUser = await objNotificationDB.Users.findOne({where:{UserName:UserName}})
            if(!isValidUser ){
                 return false
            }
            if(isValidUser){
                this.UserData = isValidUser
            }
            else{
                return {success:false , message:"Invalid user ...!"}
            }
            const IsCoolDown = await objNotificationDB.NotificationCoolDown.findOne(
                {
                    where:{UserName:UserName}
                }
            )
            if(IsCoolDown.IsCoolDown === true){
                return {success:false , message:"User is at cool down ...!"}
            }
            const IsBucketOverFlow = await objNotificationDB.NotificationBuckets.findOne(
                    {include: 
                    [{
                        model: objNotificationDB.Users,
                        attributes: ['UserName'] 
                    }]},
                    {where:{UserName:UserName}}
                )
            if(!IsBucketOverFlow){
                //Create a bucket If not bucket is available: (First Mail to Receipient)
                const CreatedBucket = await objNotificationDB.NotificationBuckets.create(
                    {
                        UserID:isValidUser.UserID,
                        BucketCreatedTime:CurrentTime,
                        NotificationsInBucket:0,
                    }
                )
                return {success:true}
            }
            //Calculate time differnece between Mail Bucket Created Time and now
            const BucketTimeWindow = this.CalculateBucketTimeDifference(this.ConvertToDateTimeFormat(IsBucketOverFlow.BucketCreatedTime) , CurrentTime)
            if (BucketTimeWindow <= ObjPublicConfigVariables.MailBucketCoolDownTime &&
                IsBucketOverFlow.NotificationsInBucket >= ObjPublicConfigVariables.MailBucketLimit){
                    await objNotificationDB.NotificationCoolDown.update(
                        {IsCoolDown:true} , 
                        {where:{userName:UserName}}
                    )
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
                    {where:{UserName:UserName}}
                )
                //Clear old buckets
                for (const Bucket of ToClear) {
                    await Bucket.destroy();
                }
                await objNotificationDB.NotificationBuckets.create({
                    UserID:this.UserData.UserID,
                    BucketCreatedTime:CurrentTime,
                    NotificationsInBucket:0
                })
                await objNotificationDB.NotificationCoolDown.update({IsCoolDown:false} , {where:{userName:UserName}})
                return {success:true}
            }
        } catch (error) {
            console.log("Error at CoolDown Computation" , error.message)
            return {success:false , message:`Failed at IsUserCoolDown: ${error.message}` }
        }
    }
    AddMailToBucket = async (UserName) => {
        try {
            let NotificationCount = await objNotificationDB.NotificationBuckets.findOne({where:{UserID:this.UserData.UserID}})
            NotificationCount.NotificationsInBucket += 1
            await objNotificationDB.NotificationBuckets.update({NotificationsInBucket:NotificationCount.NotificationsInBucket} , {where:{UserID:this.UserData.UserID}})

        } catch (error) {
            console.log("Error at adding Mail to Bucket" , error.message)
        }
    }
    CalculateBucketTimeDifference =  (BucketCreatedTime , CurrentTime) => {
        try {// Convert to ISO format
        let diffInMs = new Date(CurrentTime) - new Date(BucketCreatedTime)
        const diffInMinutes = diffInMs / (1000 * 60);
        return diffInMinutes;
        } catch (error) {
            console.log("Error at Bucket Time differnece conversion" , error.message)
        }
    }
    ConvertToDateTimeFormat =  (Param) =>{
        try {
            //Convert to SQL server DateTime Format
            const FormattedCurrentTime = new Date(Param).toISOString().slice(0, 19).replace('T', ' '); 
            return FormattedCurrentTime
        } catch (error) {
            console.log("Error while date time casting: " , error)
        }
    }
}
export class EmailVerification extends PushMail{
    constructor(UserMail , UserName) {
        super({})
        this.ParentMailOptions.to = UserMail
        this.ParentMailOptions.UserName = UserName
    }

    SendEmailVerification = async (reqID , TypeOfHTML) => {
        try {
            const IsHTMLPrepared = await this.PrepareHTML(reqID , TypeOfHTML)
            if (!IsHTMLPrepared.success) {
                console.log("Error at EmailVerification class")
                return 
            }
           const IsMailSent = this.SendMail(this.ParentMailOptions)
           if(IsMailSent){
            return true
           }
           else{
            return false
           }
            
        }
        catch (error) {
            throw error
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
            console.log("Error at EmailVerification class:", error)
            throw error
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

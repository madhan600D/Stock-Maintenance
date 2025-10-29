import { objNotificationDB } from '../Utils/NotificationDB.js'
import { EmailVerification } from '../NodeMailer/PushNotification.class.js'
import {ObjNotificationKafkaProducer} from '../Kafka/Producer/KafkaProducer.js'
import {Op} from 'sequelize'
export class UserCreation{
    constructor(UserMail , UserName){
        this.UserData
        this.ObjVerificationEmail =  new EmailVerification(UserMail , UserName)
        this.KafkaResponse = {}
        this.ErrorObj = {success:true , message:""}
    }
    CreateUser = async (UserName , UserMail , RequestHash = "" , transaction , SendMailVerification = true) => {
        try {
            await this.UserDataValidations(UserName , UserMail)

            if (!this.ErrorObj.success) {
                return {success:false , message:"User validation failed"}
            } 
            this.UserData = { UserName, UserMail }

            await this.InitializeUserTables(transaction);
            
            //TBD:Send Verification Email
            if(SendMailVerification){
                var IsEmailSent = await this.ObjVerificationEmail.SendEmailVerification(RequestHash , "Verification" , transaction)
                return IsEmailSent;
            }
            return {success:true , message:"User created successfully"}
            
        }
        catch(error) {
            this.ErrorObj = {success:false , message:"System error while user data validations" + error.message};
            return {success:false , message:"User Creation failed NS"}

        }
    }

    async InitializeUserTables(transaction){
        try {
            //Database
            const IsDataAddedAtUserTable = await this.AddUserToUsersTable(this.UserData , transaction)
            if (!this.ErrorObj.success) {
                return {success:false , message:"User creation failed"}
            } 
            this.UserData.UserID = IsDataAddedAtUserTable.NewUser.UserID

            //Database
            await this.AddUserToCoolDownTable(this.UserData , transaction)
            if (!this.ErrorObj.success) {
                return {success:false , message:"User creation failed"}
            }
        } catch (error) {
            console.log(error)
            this.ErrorObj = {success:false , message:"System error while table initializations" + error.message};
        }
    }
    UserDataValidations = async (UserName , UserMail) => {
        try {
            const IsDuplicateUser = await objNotificationDB.Users.findOne({where:{ [Op.or]: [{ UserName: UserName}, {UserMail: UserMail }] }})
            if (IsDuplicateUser){
                    this.ErrorObj = {success:false , message:"Account already registered"}
                }
            return { success: true, message: "Valid User" } 
        }
        catch (error){
            this.ErrorObj = {success:false , message:"System error while user data validations" + error.message};
            
        }
    }
    AddUserToUsersTable = async (UserData , transaction) => {
        try {
            const NewUser = await objNotificationDB.Users.create(
                {
                    UserName: UserData.UserName, 
                    UserMail: UserData.UserMail,
                    isActive: false
                });
            if(!NewUser){
                this.ErrorObj = { success: false, message: "Error while adding user to userstable"}
            }
            return { success: true, message: "User Created at User Table" , NewUser:NewUser}
        }
        catch(error) {
            this.ErrorObj = {success:false , message:"System error while user data validations" + error.message};
            
        }

    }
    AddUserToCoolDownTable = async (UserData , transaction) => {
        try {
            const NewUser = await objNotificationDB.NotificationCoolDown.create(
                {
                    UserID:UserData.UserID,
                    UserName: UserData.UserName,
                    UserMail: UserData.UserMail,
                    IsCoolDown: false
                } , {transaction:transaction})
            if(!NewUser){
                this.ErrorObj.success = false
                return { success: false, message: "Error at creating user at Users table" }
            }
            return { success: true, message: "User Created at CoolDown Table" }
        }
        catch (error) {
            this.ErrorObj = {success:false , message:"System error in user creation class" + error.message};
            
        }
    }
    SendKafkaResponse = async (success , ) => {
        try {
            
        } catch (error) {
            console.log(`Error while producing kafka response:` + error.toString())
        }
    }
}
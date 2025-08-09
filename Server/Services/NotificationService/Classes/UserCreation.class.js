import { objNotificationDB } from '../Utils/NotificationDB.js'
import { EmailVerification } from '../NodeMailer/PushNotification.class.js'
import {ObjNotificationKafkaProducer} from '../Kafka/Producer/KafkaProducer.js'
import {Op} from 'sequelize'
export class UserCreation{
    constructor(UserMail , UserName){
        this.UserData
        this.ObjVerificationEmail =  new EmailVerification(UserMail , UserName)
    }
    CreateUser = async (UserName , UserMail , RequestHash) => {
        try {
            let KafkaResponse
            const IsValidUser = await this.UserDataValidations(UserName , UserMail)
            if (!IsValidUser.success) {
                console.log("User validation failed: " + IsValidUser.message);
                return {success:false , message:"User validation failed"}
            } 
            this.UserData = { UserName, UserMail }

            const IsDataAddedAtUserTable = await this.AddUserToUsersTable(this.UserData)
            if (!IsDataAddedAtUserTable.success) {
                console.lo("User Creation failed: " , IsDataAddedAtUserTable.message)
            } 
            this.UserData.UserID = IsDataAddedAtUserTable.NewUser.UserID
            const IsDataAddedAtCoolDownTable = await this.AddUserToCoolDownTable(this.UserData)
            if (!IsDataAddedAtCoolDownTable.success) {
                throw new Error("User Creation failed: ", IsDataAddedAtCoolDownTable.message)
            }
            //TBD:Send Verification Email
            const IsEmailSent = await this.ObjVerificationEmail.SendEmailVerification(RequestHash , "Verification")
            //TBD: Produce a kafka response: User Added Succesfully
            if(IsEmailSent){
                KafkaResponse.Event = 'EmailSent'
                KafkaResponse.Data = {Success:true , UserName:this.UserData.UserName , UserMail:this.UserData.UserMail}
                await ObjNotificationKafkaProducer.ProduceEvent(KafkaResponse.Event , 'user.create_user.response' , KafkaResponse)
            }
            else{
                KafkaResponse.Event = 'EmailSent'
                KafkaResponse.Data = {Success:false , UserName:this.UserData.UserName , UserMail:this.UserData.UserMail}
                await ObjNotificationKafkaProducer.ProduceEvent(KafkaResponse.Event , 'user.create_user.response' , KafkaResponse)   
            }
        }
        catch(error) {
            console.log("Error At Create User Function" ,error)
        }
    }
    UserDataValidations = async (UserName , UserMail) => {
        try {
            const IsDuplicateUser = await objNotificationDB.Users.findOne({where:{ [Op.or]: [{ UserName: UserName}, {UserMail: UserMail }] }})
            if (IsDuplicateUser) {
                return {success:false , message: "Duplicate User"}
            }
            return { success: true, message: "Valid User" } 
        }
        catch (error){
            console.log("Error at UserDataValidations" , error)
        }
    }
    AddUserToUsersTable = async (UserData) => {
        try {
            const NewUser = await objNotificationDB.Users.create(
                {
                    UserName: UserData.UserName, 
                    UserMail: UserData.UserMail,
                    isActive: false
                })
            if(!NewUser){
                return { success: false, message: "Error at creating user at Users table"  }
            }
            return { success: true, message: "User Created at User Table" , NewUser:NewUser}
        }
        catch(error) {
            throw error
        }

    }
    AddUserToCoolDownTable = async (UserData) => {
        try {
            const NewUser = await objNotificationDB.NotificationCoolDown.create(
                {
                    UserID:UserData.UserID,
                    UserName: UserData.UserName,
                    UserMail: UserData.UserMail,
                    IsCoolDown: false
                })
            if(!NewUser){
                return { success: false, message: "Error at creating user at Users table" }
            }
            return { success: true, message: "User Created at CoolDown Table" }
        }
        catch (error) {
            throw error
        }
    }
    SendKafkaResponse = async (success , ) => {
        try {
            
        } catch (error) {
            console.log(`Error while producing kafka response:` + error.toString())
        }
    }
}
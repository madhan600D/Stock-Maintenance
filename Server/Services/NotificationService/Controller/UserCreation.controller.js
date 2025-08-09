import { UserCreation } from "../Classes/UserCreation.class.js"
import { EmailVerification } from "../NodeMailer/PushNotification.class.js"
export const CreateUserController = async (Topic , Partition , Message) =>{
    try {
        //Kafka Strcuture = {Event:'SendVerificationEmail' , Data: {ReqID,userName,userMail,verificationHash}
        if(Message.Event == 'SendVerificationEmail'){
            const ObjUserCreation = new UserCreation(Message.Data.userMail , Message.Data.userName)
            const IsUserCreated = await ObjUserCreation.CreateUser(Message.Data.userName , Message.Data.userMail , Message.Data.verificationHash)
            return IsUserCreated ? {success:true , message:"User created at Notification service end"} : {success:false , message:"User creation failed at Notification service end"}
        }
        else if (Message.Event == 'ResendVerificationEmail'){
            //Kafka structure:{Event , Data:{UserMail , UserName , VerificationHash}}
            const ObjVerificationEmail = new EmailVerification(Message.Data.UserMail , Message.Data.UserName)
            const IsVerificationMailReSent =  await ObjVerificationEmail.SendEmailVerification(Message.Data.VerificationHash , "Verification")
            return IsVerificationMailReSent ? {success:true , message:"Verification Mail ReSent"} : {success:false , message:"Verification mail resent failed"}
        }
    } catch (error) {
        return {success:false , message:`Notification Server side error at User Creation Controller` + error.message}
    } 
    
} 
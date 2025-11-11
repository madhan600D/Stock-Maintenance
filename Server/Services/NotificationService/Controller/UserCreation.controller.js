import { UserCreation } from "../Classes/UserCreation.class.js"
import { EmailVerification } from "../NodeMailer/PushNotification.class.js"
import { objNotificationDB } from "../Utils/NotificationDB.js"
export const CreateUserController = async (Topic , Partition , Message) =>{
    try {
        //Kafka Strcuture = {Event:'SendVerificationEmail' , Data: {ReqID,userName,userMail,verificationHash}
        let CreateUserTransaction = await objNotificationDB.NotificationDB.transaction()
        if(Message.Event == 'SendVerificationEmail'){
            const ObjUserCreation = new UserCreation(Message.Data.userMail , Message.Data.userName)
            const IsUserCreated = await ObjUserCreation.CreateUser(Message.Data.userName , Message.Data.userMail , Message.Data.verificationHash , CreateUserTransaction)
            if(IsUserCreated?.success){ 
                await CreateUserTransaction.commit()   
                 return {success:true , message:"User created at Notification service end"}
            }  
            else{
                await CreateUserTransaction.rollback()
                return {success:false , message:"User creation failed at Notification service end"}
            } 
        }
        else if (Message.Event == 'ResendVerificationEmail'){
            //Kafka structure:{Event , Data:{UserMail , UserName , VerificationHash}}
            const ObjVerificationEmail = new EmailVerification(Message.Data.UserMail , Message.Data.UserName)
            const IsVerificationMailReSent =  await ObjVerificationEmail.SendEmailVerification(Message.Data.VerificationHash , "Verification" , CreateUserTransaction) 
            if(IsVerificationMailReSent?.success){
                await CreateUserTransaction.commit()
                 return {success:true , message:"Verification Mail sent "}
            }  
            else{
                await CreateUserTransaction.rollback()
                return {success:false , message:"Mail resent failed at Notification service end"}
            } 
        }
        else if(Message.Event === "CreateExternalUser"){
            const ObjUserCreation  = new UserCreation(Message.Data.UserMail , Message.Data.UserName);
            const UserData = {UserName:Message.Data.UserName , UserMail:Message.Data.UserMail}
            
            const NewUser = await ObjUserCreation.CreateUser(UserData.UserName , UserData.UserMail , "" , CreateUserTransaction , false);

            if(NewUser.success){
                await CreateUserTransaction.commit()
                return NewUser
            }
            else{
                await CreateUserTransaction.rollback();
                return NewUser
            }
            
        }
    } catch (error) {
        !CreateUserTransaction.finished ? await CreateUserTransaction.rollback() : ""
        return {success:false , message:`Notification Server side error at User Creation Controller` + error.message}
    } 
    
} 
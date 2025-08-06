import { UserCreation } from "../Classes/UserCreation.class.js"
import { EmailVerification } from "../NodeMailer/PushNotification.class.js"
export const CreateUserController = async (Topic , Partition , Message) =>{
    try {
        //Kafka Strcuture = {Event:'SendVerificationEmail' , Data: {ReqID,userName,userMail,verificationHash}
        if(Message.Event == 'SendVerificationEmail'){
            const ObjUserCreation = new UserCreation(Message.Data.userMail , Message.Data.userName)
            await ObjUserCreation.CreateUser(Message.Data.userName , Message.Data.userMail , Message.Data.verificationHash)
        }
        else if (Message.Event == 'ResendVerificationEmail'){
            //Kafka structure:{Event , Data:{UserMail , UserName , VerificationHash}}
            const ObjVerificationEmail = new EmailVerification(Message.Data.UserMail , Message.Data.UserName)
            await ObjVerificationEmail.SendEmailVerification(Message.Data.VerificationHash , "Verification")
        }
    } catch (error) {
        
    } 
    
} 
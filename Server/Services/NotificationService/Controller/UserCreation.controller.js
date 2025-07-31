import { UserCreation } from "../Classes/UserCreation.class.js"
export const CreateUserController = async (Topic , Partition , Message) =>{
    try {
        //Kafka Strcuture = {Event:'SendVerificationEmail' , Data: {ReqID,userName,userMail,verificationHash}
        if(Message.Event = 'SendVerificationEmail'){
            const ObjUserCreation = new UserCreation(Message.Data.userMail , Message.Data.userName)
            await ObjUserCreation.CreateUser(Message.Data.userName , Message.Data.userMail , Message.Data.verificationHash)
        }
        else if (Message.Event = 'ResendVerificationEmail'){
            //TBD:
        }
    } catch (error) {
        
    } 
    
}
import {ConfirmUser} from "../Classes/ConfirmUser.class.js"

export const ConfirmUserController = async (Topic , Partition , Message) => {
    try {
        //Kafka Strcuture = {Event:'UserVerified' , Data: {UserMail,userName}
        if(Message.Event == 'UserVerified'){
            const ObjConfirmUser = new ConfirmUser(Message.Data.userMail , Message.Data.userName)
            const IsUserVerified = await ObjConfirmUser.ConfirmUser()
            
            return IsUserVerified ? {success:true , message:"User confirmed at Notification service end"} : {success:false , message:"User confirmation failed at Notification service end"}
        }
    } catch (error) {
      return {success:false , message:`Notification Server side error at User confirmation Controller` + error.message}
    } 
    
} 
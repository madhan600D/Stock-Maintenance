import {ConfirmUser} from "../Classes/ConfirmUser.class.js"

export const ConfirmUserController = async (Topic , Partition , Message) => {
    try {
        //Kafka Strcuture = {Event:'UserVerified' , Data: {UserMail,userName}
        if(Message.Event == 'UserVerified'){
            const ObjConfirmUser = new ConfirmUser(Message.Data.userMail , Message.Data.userName)
            const IsUserVerified = await ObjConfirmUser.ConfirmUser()
            
            return {success:IsUserVerified , message:""}
        }
    } catch (error) {
      console.log("Error while confirming user" + error.toString())  
    } 
    
} 
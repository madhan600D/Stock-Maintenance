import { PushMail } from "../NodeMailer/PushNotification.class";
import { objNotificationDB } from "../Utils/NotificationDB.js";

export const SendMail = async (Topic , Partition , Message) => {
    try {
        //Kafka Strcuture = {Event:'GroupMailInvitation' , Data: {GroupOfUsers,Organization,UserData}
        if(Message.Event == 'SingleMail'){
            const MailOptions = {UserName:Message.Data.UserName , UserMail:Message.Data.UserMail, HTML:Message.Data.HTML}
            const MailTransAction = await objNotificationDB.NotificationDB.transaction()
            const ObjPushMail = new PushMail(MailOptions)
            const IsMailSent = await ObjPushMail.SendMail(MailTransAction)
            return IsMailSent
        }
    }
    catch(error){
        console.log(error.message)
        return {success:false , message:"Mail failed...!"};
    }
}
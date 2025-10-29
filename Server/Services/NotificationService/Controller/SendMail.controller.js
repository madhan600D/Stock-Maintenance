import { PushMail } from "../NodeMailer/PushNotification.class.js";
import { objNotificationDB } from "../Utils/NotificationDB.js";

export const SendMail = async (Topic , Partition , Message) => {
    try {
        //Kafka Strcuture = {Event:'GroupMailInvitation' , Data: {GroupOfUsers,Organization,UserData}
        if(Message.Event == 'SingleMail'){
            const MailOptions = {UserName:Message.Data.UserName , UserMail:Message.Data.UserMail, html:Message.Data.HTML , to:Message.Data.User , subject:Message.Data.Subject};
            const MailTransAction = await objNotificationDB.NotificationDB.transaction()
            const ObjPushMail = new PushMail(MailOptions)
            const IsMailSent = await ObjPushMail.SendMail(MailTransAction)
            IsMailSent ? await MailTransAction.commit() : await MailTransAction.rollback();
            return IsMailSent
        }
    }
    catch(error){
        console.log(error.message)
        await MailTransAction.rollback()
        return {success:false , message:"Mail failed...!"};
    }
}
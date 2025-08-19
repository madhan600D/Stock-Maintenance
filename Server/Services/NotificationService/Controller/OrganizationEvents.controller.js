import {GroupInvitation} from '../Classes/OrganizationEvents.class.js'
import { ObjNotificationKafkaProducer } from '../Kafka/Producer/KafkaProducer.js';

export const OrganizationEvents = async (Topic , Partition , Message) =>{
    try {
        //Kafka Strcuture = {Event:'GroupMailInvitation' , Data: {GroupOfUsers,Organization,UserData}
        if(Message.Event == 'GroupMailInvitation'){
            let ObjGroupInvitation = new GroupInvitation(Message.Data.GroupOfUsers , Message.Data.Organization , Message.Data.UserData);
            const IsInviteSent = await ObjGroupInvitation.SendGroupInvitation();
            return IsInviteSent.success ? {success:true , message:"Users invited successfully"} : {success:false , message:"Invitation sending failed...!"}
        }
    }
    catch(error){
        console.log(error.message)
        return {success:false , message:"Invitation sending failed...!"};
    }
}

import { Op } from "sequelize";
import { ObjNotificationKafkaProducer } from "../Kafka/Producer/KafkaProducer.js";
import { objNotificationDB } from "../Utils/NotificationDB.js";
export class ConfirmUser {
    constructor(userMail , userName) {
        this.UserData = {userMail , userName}
        this.KafkaMessage
    }
    ConfirmUser = async () => {
        try {
            if(!this.Validate()){
                console.log("User confirmation validation")
                return {success:false , message:"User is already active...! or Invalid user Data"} 
            }

        const [UpdatedUserCount,UpdatedUser] = await objNotificationDB.Users.update({isActive:true} , {where:{UserMail:this.UserData.UserMail} , returning:true})

        if(!UpdatedUser){
            return {success:false , message:"Invalid user to confirm"} 
        }
        else{
            return {success:true , message:"User activated ...!"}
        }
        } catch (error) {
            console.log("Error at confirm user" + error)
        }
        
    }   
    Validate = async () => {
        try {
            const IsUserAlreadyVerified = await objNotificationDB.Users.findOne({where: {[Op.and] : {UserName:this.UserData?.UserName , isActive:false}}})
            if(IsUserAlreadyVerified){
                return false
            }
            return true
        } catch (error) {
            
        }
    }
    PrepareKafkaMessageAndPush = async (Event , success) => {
        try {
            this.KafkaMessage.Event = Event
            this.KafkaMessage.Data = {success:success , UserName:this.UserData.UserName , UserMail:this.UserData.UserMail} 
            await ObjNotificationKafkaProducer.ProduceEvent(this.KafkaMessage.Event , "user.confirm_user.response" , this.KafkaMessage)
        } catch (error) {
            console.log("Error while preparing kafka message" + error)
        }
                  
    } 
}
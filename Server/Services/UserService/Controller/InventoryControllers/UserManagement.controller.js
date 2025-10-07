import objUserDb from "../../Utils/userDB.js";
import objInventoryDataBase from "../../Utils/InventoryDB.js";
import { where } from "sequelize";
import { PrepareHTML } from "../../Utils/PrepareUserHTML.js";
import { ObjUserKafkaProducer } from "../../Kafka/Producer/kafkaProducer.js";

export const GetUsers = async (req , res) => {
    try {
        const {OrgID} = req?.query;
        const UsersPerOrganization = await objUserDb.AllModels.users.findAll({where:{organizationId:OrgID}});

        return res.status(200).json({success:true , data:UsersPerOrganization})
    } catch (error) {
        
    }
}

export const GetVendors = async (req , res) => {
    try {
        const Vendors = await objUserDb.AllModels.Vendors.findAll({raw:true});
        return res.status(200).json({success:true , data:Vendors})
    } catch (error) {
        
    }
}

export const AlterWorker = async (req , res) => {
    try {
        const {UserID , NewRole} = req?.body;
        let KafkaMessage = {}
        const RoleData = await objUserDb.AllModels.RoleDetails.findOne({where:{RoleName:NewRole}});
        const UpdatedRole = await objUserDb.AllModels.roles.update({roleId:RoleData.RoleID , RoleName:RoleData.RoleName} , 
            {where:{userId:UserID}});

        const UserDetails = await objUserDb.AllModels.users.findOne(
                                        {include: 
                                        [{
                                            model: objUserDb.AllModels.organizations,
                                            attributes: ['organizationName'] 
                                        }]},
                                        {where:{userId:req.user.userId}});

        const HtmlData = {UserName:UserDetails.userName , UserMail:UserDetails.userMail , Organization:UserDetails.organizations.organizationName}

        //Send a mail event to kafka
        const HTMLDataResult = await PrepareHTML("RoleChange" , HtmlData)

        //Kafka Message
        KafkaMessage.Event = "SingleMail"
        KafkaMessage.Data = {UserMail:UserDetails.userMail , UserName:UserDetails.userName ,Data:{HTML:HTMLDataResult}}
        await ObjUserKafkaProducer.ProduceEvent("SingleMail" , "user.new_mail.request" , KafkaMessage);

        return res.status(200).json({success:true , message:`Role updated: ${UserID}` , data:UpdatedRole})

        //TBD:Mail to indicate the user that he has been promoted/demoted
    } catch (error) {
        
    }
}


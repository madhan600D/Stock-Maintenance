import objUserDb from "../../Utils/userDB.js";
import objInventoryDataBase from "../../Utils/InventoryDB.js";
import { Op, where } from "sequelize";
import { PrepareHTML } from "../../Utils/PrepareUserHTML.js";
import { ObjUserKafkaProducer } from "../../Kafka/Producer/kafkaProducer.js";
import AccessControl from "../../Class/AccessControl.class.js";
import { TaskTypesEnum } from "../../Declarations/PublicEnums.js";

import {UserManagement} from '../../Class/UserManagement.class.js'

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
        return res.status(500).json({success:false , message:`Server side error while updating role`})
    }
}


export const GetOpenTasks = async (req , res) => {
    try {
        const OpenTasks = await objInventoryDataBase.AllModels.Tasks.findAll({where:{[Op.and]:[{OrganizationID:req.user.organizationId} , {IsActive:1}]} , raw:true});

        let OpenTasksRequesterID = [] , DataToClient = [];
        for(let Task of OpenTasks){
            OpenTasksRequesterID.push(Task.TargetUserID)
        }

        const RequesterNames = await objUserDb.AllModels.users.findAll({
            attributes:['userId' , 'userName' , 'userMail'],
            where:{userId:{[Op.in]:[...OpenTasksRequesterID]}},
            raw:true
        });
        
        for(let Task of OpenTasks){
            const RequesterDetails = RequesterNames.find(Request => Request.userId == Task.TargetUserID);
            let Temp = {
                TaskID:Task.TaskID,
                RequesterName:RequesterDetails.userName,
                RequesterMail:RequesterDetails.userMail,
                TaskRaisedAt:Task.TaskCreatedAt
            }
            DataToClient.push(Temp)
        }
        return res.status(200).json({success:true , data:DataToClient})
    } catch (error) {
        return res.status(500).json({success:false , message:`Server side error while getting tasks`})
    }
}

export const AddRequestTask = async (req , res) => {
    try {
        const {OrganiationToJoinID} = req.body;
        //Get Parameters
        const UserDetails = await objInventoryDataBase.AllModels.users.findOne({where:{userId:req.user.userId} , raw:true});

        //Init
        const ObjUserManagement = new UserManagement(objInventoryDataBase , AccessControl , Op , UserDetails , {} , {OrganizationID:OrganiationToJoinID} , {})

        await ObjUserManagement.RaiseJoiningTask()

        return res.status(200).json({success:true , message:"Join Request sent to Organization Admin"})  
    } catch (error) {
        return res.status(500).json({success:false , message:`Server side error while getting tasks`})
    }
}

export const HandleTask = async (req , res) => {
    try {
        const {TaskType , TaskID} = req.body;
        switch (TaskType){
            case TaskTypesEnum.ACCEPT: 
                //Get Parameters
                const TaskDetails = await objInventoryDataBase.AllModels.Tasks.findOne({where:{TaskID:TaskID} , raw:true});

                //Init
                const ObjUserManagement = new UserManagement(objInventoryDataBase , AccessControl , Op , {UserID:req.user.userId} , {TargetUserID:TaskDetails.TargetUserID} , {OrganizationID:TaskDetails.OrganizationID} , TaskDetails);

                //Call
                const IsSuccess = await ObjUserManagement.AcceptJoiningTask();

                return res.status(IsSuccess.success == true  ? 200 : 400).json(IsSuccess);
            case TaskTypesEnum.REJECT:
                //Get Parameters
                const TaskDetailsToReject = await objInventoryDataBase.AllModels.Tasks.findOne({where:{TaskID:TaskID} , raw:true});

                //Init
                const ObjUserManagementToReject = new UserManagement(objInventoryDataBase , AccessControl , Op , {UserID:req.user.userId} , {TargetUserID:TaskDetailsToReject.TargetUserID} , {OrganizationID:TaskDetailsToReject.OrganizationID} , TaskDetails);

                //Call
                const IsSuccessToReject = await ObjUserManagementToReject.RejectTask();

                return res.status(IsSuccessToReject.success == true  ? 200 : 400).json(IsSuccessToReject);
        }
    } catch (error) {
        return res.status(500).json({success:false , message:`Server side error while handling tasks`})
    }
}

import { Op } from "sequelize"

//DataBase
import objUserDb from "../../Utils/userDB.js"

//Kafka
import {ObjUserKafkaProducer} from '../../Kafka/Producer/kafkaProducer.js'
import { raw } from "express"

export const joinOrg = async (req , res) => {
    //TBD: When adding user to a ORG a mail is sent to Admin and a task will be added in his task list
    //API Structure:{JoinId , userName , userId} request
    //API Structure:{JoinMethod , userName , userId , OrganizationJoiningCode} referral
    try {
        const JoinOrgTransaction = objUserDb.AllModels.userDB.transaction()
        const {JoinMethod} = req.body
        let errorMessage
        let ValidUser = await objUserDb.AllModels.users.findOne({where:{[Op.and]:{userId:req.user.userId , organizationId:1}}})
        if(!ValidUser){
            errorMessage = "Invalid user, Cannot join organization ...!"
            await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
            return res.status(400).json({success:false , message:errorMessage})
        }
        switch (JoinMethod){ 
            case "request":
                //TBD:A mail will be sent to Org admin who can accept the request
                break
            case "referral":
                const OrganizationJoiningCode = req.body.OrganizationJoiningCode
                if(!OrganizationJoiningCode){
                    errorMessage = "Please provide a organization code ...!"
                    await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }

                const isOrgCodeExists = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationJoiningCode}})
                if(!isOrgCodeExists){
                    errorMessage = "Please provide a valid organization code ...!"
                    await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }
                //Update the users Table organizationId
                const joinedOrg = await objUserDb.AllModels.users.update({organizationId:isOrgCodeExists.organizationId} , 
                                                                 {where:{userId:req.user.userId} , transaction:JoinOrgTransaction})
                
                const updatedUser = await objUserDb.AllModels.users.findOne({include:[{
                        model:objUserDb.AllModels.organizations, attributes:['organizationName']}
                    ]},{where:{userName:req.user.userId} , transaction:JoinOrgTransaction}) 

                const NewRole = await objUserDb.AllModels.roles.create({userId:req.user.userId , roleId:3 , role:"Staff" , organizationId:joinOrg.organizationId} , {transaction:JoinOrgTransaction})
                
                const DataToClient = {organizationName:updatedUser.organizatinName , organizationId:updatedUser.organizationId , }

                await JoinOrgTransaction.commit()
                return res.status(200).json({success:true , message:  `Sucessfully joined ${updatedUser.organization.organizationName}` , data:DataToClient})
        }
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await JoinOrgTransaction.rollback()
        return req.status(500).json({success:false , message:error.message});
    }
}
export const createOrg = async (req , res) => {
    //At front end all organization related details should be displayed after created
    //Ability to send Invite to join this Application to others VIA Email :: How? A verification code is sent via mail
    //Entering the code will add the user to the org
    try {
        //API Structure: {organizationName , typeOfBusiness , street , city , country , pincode , userId}
        const CreateOrgTransaction = objUserDb.AllModels.userDB.transaction();
        let errorMessage , OrganizationCode
        const {OrganizationName , BusinessType , Street , City , Country , PinCode} = req?.body
        //8 Digit unique ID --> Generate untill no Id is Found in DB
        OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
        let isIDExist = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        while(isIDExist){
                OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
                isIDExist = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        }
        //Add in Org Table and Admin Table
        const newOrganization = await objUserDb.AllModels.organizations.create({organizationName:OrganizationName.toUpperCase() , 
                                        typeofBusiness:BusinessType,
                                        street:Street,
                                        city:City,
                                        country:Country,
                                        pincode:PinCode,
                                        OrganizationJoiningCode:OrganizationCode
        } , {transaction:CreateOrgTransaction})
        await objUserDb.AllModels.admins.create({organizationId:newOrganization.organizationId , 
                                       adminId:req.user.userId,
                                       organizationName:OrganizationName.toUpperCase()
        } , {transaction:CreateOrgTransaction})
        await objUserDb.AllModels.roles.create({userId:req.user.userId , 
                                       roleId:1, role:'Admin' , organizationId:newOrganization.organizationId} , {transaction:CreateOrgTransaction})

        await objUserDb.AllModels.users.update(
            { organizationId: newOrganization.organizationId }, 
            { where: { userId: req.user.userId } , transaction:CreateOrgTransaction }        
        );

        await CreateOrgTransaction.commit()
        //TBD:Call mail service and send mail to Admin with welcome details:Kafka
        return res.status(200).json({success:true , message:`Sucessfully created organization ${newOrganization.organizationName}` , data:newOrganization});
        
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await CreateOrgTransaction.rollback()
        return res.status(500).json({success:false , message:error.message})
    }
}
export const groupInviteToOrg = async (req , res ) => {
    //API Strcuture = {GroupOfUsers[Array]}
    try {
        let KafkaMessage  = {}
        KafkaMessage.Data = {GroupOfUsers:req.body.GroupOfUsers , Organization:req.OrganizationData, UserData:req.UserData};
        KafkaMessage.Event = "GroupMailInvitation"
        const IsSuccess = await ObjUserKafkaProducer.ProduceEvent("GroupMailInvitation" , "user.group_mail" , KafkaMessage);
        if(!IsSuccess){ 
            res.status(500).json({success:false , message:"Can't invite users to organization , Server failed ...!"})
        }
        res.status(200).json({success:false , message:"Organization invitation mail sent to mentioned users ...!"});
    } catch (error) {
     res.status(500).json({success:false , message:"Group invitation failed at server side"});
    }
}

export const leaveOrg = async (req ,res) => {

}
export const getOrganizations = async (req , res) => {
    try {
        const AllOrganizations = await objUserDb.AllModels.organizations.findAll({where:{organizationName:{[Op.ne]:'New'}}, attributes:['organizationName'] , raw:true})

        return res.status(200).json({success:true , data:AllOrganizations})
    } catch (error) {
        
    }
}

export const acceptOrgRequest = async (req) =>{
    try {
        //API Structure: /:userID
        const userId = req.query?.userId , orgId = req.query?.orgId
        const isValidUser = await objUserDb.AllModels.users.findOne({[Op.and]:{where:{userId: userID , organizationId:1}}})
        if(isValidUser){
            await objUserDb.AllModels.users.update({organizationId:orgId} , {where:{userId:userId}})
        }
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
    }
}
import { Op } from "sequelize"

//DataBase
import objUserDb from "../Utils/userDB.js"

//Kafka
import {ObjUserKafkaProducer} from '../Kafka/Producer/kafkaProducer.js'

export const joinOrg = async (req , res) => {
    //TBD: When adding user to a ORG a mail is sent to Admin and a task will be added in his task list
    //API Structure:{JoinId , userName , userId} request
    //API Structure:{JoinMethod , userName , userId , OrganizationJoiningCode} referral
    try {
        const {JoinMethod , userName , userId} = req.body
        let errorMessage
        let isUserExists = await objUserDb.users.findOne({where:{userId:userId}})
        if(!isUserExists){
            errorMessage = "Invalid user, Cannot join organization ...!"
            await objUserDb.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
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
                    await objUserDb.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }

                const isOrgCodeExists = await objUserDb.organizations.findOne({where:{OrganizationJoiningCode:OrganizationJoiningCode}})
                if(!isOrgCodeExists){
                    errorMessage = "Please provide a valid organization code ...!"
                    await objUserDb.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }
                //Update the users Table organizationId
                const joinedOrg = await objUserDb.users.update({organizationId:isOrgCodeExists.organizationId} , 
                                                                 {where:{userId:userId}})
                
                const updatedUser = await objUserDb.users.findOne({include:[{
                        model:objUserDb.organizations, attributes:['organizationName']}
                    ]},{where:{userName:userName}}) 
                    return res.status(200).json({success:true , message:  `Sucessfully joined ${updatedUser.organization.organizationName}` , data:joinedOrg})
        }
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message});
    }
}
export const createOrg = async (req , res) => {
    //At front end all organization related details should be displayed after created
    //Ability to send Invite to join this Application to others VIA Email :: How? A verification code is sent via mail
    //Entering the code will add the user to the org
    try {
        //API Structure: {organizationName , typeOfBusiness , street , city , country , pincode , userId}
        let errorMessage , OrganizationCode
        const {OrganizationName , BusinessType , Street , City , Country , PinCode} = req?.body
        //8 Digit unique ID --> Generate untill no Id is Found in DB
        OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
        let isIDExist = await objUserDb.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        while(isIDExist){
                OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
                isIDExist = await objUserDb.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        }
        //Add in Org Table and Admin Table
        const newOrganization = await objUserDb.organizations.create({organizationName:OrganizationName.toUpperCase() , 
                                        typeofBusiness:BusinessType,
                                        street:Street,
                                        city:City,
                                        country:Country,
                                        pincode:PinCode,
                                        OrganizationJoiningCode:OrganizationCode
        })
        await objUserDb.admins.create({organizationId:newOrganization.organizationId , 
                                       adminId:req.user.userId,
                                       organizationName:OrganizationName.toUpperCase()
                                       
        })
        //TBD:Call mail service and send mail to Admin with welcome details:Kafka
        return res.status(200).json({success:true , message:`Sucessfully created organization ${newOrganization.organizationName}` , data:newOrganization});
        
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }
}
export const groupInviteToOrg = async (req , res ) => {
    //API Structure:{GroupOfUsers:[array]}
    try {
        let KafkaEvent = {GroupOfUsers:req.body.GroupOfUsers , OrganizationJoiningCode:req.OrganizationData.OrganizationJoiningCode , OrganizationName:req.OrganizationData.OrganizationName};
        const IsSuccess = ObjUserKafkaProducer.ProduceEvent("Invite_Users" , "user.group_mail" , KafkaEvent);
        if(!IsSuccess){
            res.status(500).json({success:false , message:"Can't invite users to organization , Server failed ...!"})
        }
        res.status(200).json({success:false , message:"Organization invitation mail sent to mentioned users ...!"});
    } catch (error) {
     res.status(500).json({success:false , message:"Group invitation failed at server side"})   
    }
}

export const leaveOrg = async (req ,res) => {

}

export const acceptOrgRequest = async (req) =>{
    try {
        //API Structure: /:userID
        const userId = req.query?.userId , orgId = req.query?.orgId
        const isValidUser = await objUserDb.users.findOne({[Op.and]:{where:{userId: userID , organizationId:1}}})
        if(isValidUser){
            await objUserDb.users.update({organizationId:orgId} , {where:{userId:userId}})
        }
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
    }
}
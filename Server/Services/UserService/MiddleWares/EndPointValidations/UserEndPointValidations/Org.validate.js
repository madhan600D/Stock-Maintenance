import { Op } from "sequelize"
import objUserDb from "../../../Utils/userDB.js"
import AccessControl from "../../../Class/AccessControl.class.js"
import { ActionEnum, ControlEnum, RolesEnum } from "../../../Declarations/PublicEnums.js"
export const CreateOrgValidate = async (req , res , next) => {
    try {
        const {OrganizationName , TypeOfBusiness , Address , ClosingTime , Weekends} = req?.body 

        if([OrganizationName , TypeOfBusiness , Address.Street , Address.City , Address.Country , Address.Pincode , ClosingTime , Weekends].some(element => element === undefined)){
            return res.status(400).json({success:false , message:"Please fill all the fields...!"})
        }
        const isOrgExist = await objUserDb.AllModels.organizations.findOne({where:{organizationName:OrganizationName.toUpperCase()}})
        if(isOrgExist){
            errorMessage = "Organization name exists"
            await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
            return res.status(400).json({success:false , message:errorMessage})
        }
        next() 
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }   
} 

export const GroupInviteToOrgValidate = async (req , res , next) => {
    try {
        //API Structure {GroupOfUsers:[array]}
        let {GroupOfUsers}= req?.body;
        let UserID = req.user.userId;
        if(!GroupOfUsers){
            res.status(400).json({success:false , message:"Add users to invite to organization ...!"})
        }
        const IsValidAdmin = await objUserDb.AllModels.admins.findOne({
                                                      include:[{model:objUserDb.AllModels.users , attributes:['userName' , 'userMail']}, 
                                                               {model:objUserDb.AllModels.organizations , attributes:['OrganizationJoiningCode' , 'organizationName']}],
                                                      where:{adminId:UserID}
                                                      })
        //If requester is not valid admin to an organization
        if(!IsValidAdmin){
            res.status(400).json({success:false , message:"Not authorized to invite to this organization ...!"})
        }
        //If the group users array is empty
        if(GroupOfUsers?.length > 5){
            res.status(400).json({success:false , message:"5 Users can be invited at a time...!"})
        }
        //Validate if self invitation is triggered
        GroupOfUsers = GroupOfUsers.filter((User) => User !== IsValidAdmin.user.userMail && User !== '');

        //Attach Org Data to the next middle ware
        req.OrganizationData = {OrganizationName:IsValidAdmin.organization.organizationName ,
                                OrganizationJoiningCode:IsValidAdmin.organization.OrganizationJoiningCode};

        req.UserData = {UserName:IsValidAdmin.user.userName , UserID:UserID}

        next();
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }
}

export const CloseDayValidate = async(req , res , next) => {
    try {
        const ObjAccessControl = new AccessControl()
        const IsPermitted = await ObjAccessControl.VerifyAccessControl(req.user.userId , ActionEnum.ALTER , ControlEnum.SETTINGS);

        if(!IsPermitted){
            return res.status(400).json({success:false , message:"You don't have access to close day."})
        }

        next()
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }
}

export const LeaveOrgValidate = async(req , res , next) => {
    try {
        //1. No admin can leave the organization.
        const RoleDetail = await objUserDb.AllModels.roles.findOne({where:{userId:req.user.userId}});
        if(RoleDetail.role === RolesEnum.Admin){
            return res.status(400).json({success:false , message:"Admin can't exit org"})
        }
        next()
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }
}
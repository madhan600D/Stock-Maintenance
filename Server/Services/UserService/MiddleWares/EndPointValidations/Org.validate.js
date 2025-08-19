import { Op } from "sequelize"
import objUserDb from "../../Utils/userDB.js"
export const CreateOrgValidate = async (req , res , next) => {
    try {
        const {OrganizationName , BusinessType , Street , City , Country , PinCode} = req?.body

        if([OrganizationName , BusinessType , Street , City , Country , PinCode].some(element => element === undefined)){
            return res.status(400).json({success:false , message:"Please fill all the fields...!"})
        }
        const isOrgExist = await objUserDb.organizations.findOne({where:{organizationName:OrganizationName.toUpperCase()}})
        if(isOrgExist){
            errorMessage = "Organization name exists"
            await objUserDb.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
            return res.status(400).json({success:false , message:errorMessage})
        }
        next() 
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }   
} 

export const GroupInviteToOrgValidate = async (req , res , next) => {
    try {
        //API Structure {GroupOfUsers:[array]}
        const GroupOfUsers= req.body?.GroupOfUsers;
        let UserID = req.user.userId;
        const IsValidAdmin = await objUserDb.admins.findOne({
                                                      include:[{model:objUserDb.users , attributes:['userName']}, 
                                                               {model:objUserDb.organizations , attributes:['OrganizationJoiningCode' , 'organizationName']}],
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
        //Attach Org Data to the next middle ware
        req.OrganizationData = {OrganizationName:IsValidAdmin.organization.organizationName ,
                                OrganizationJoiningCode:IsValidAdmin.organization.OrganizationJoiningCode};

        req.UserData = {UserName:IsValidAdmin.user.userName , UserID:UserID}

        next();
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:error.message})
    }
}
import objInventoryDataBase from "../../../Utils/InventoryDB.js";
import objUserDb from "../../../Utils/userDB.js"

export const AlterUserValidate = async (req , res , next) => {
    try {
        const {UserID , NewRole} = req?.body;
 
        if([UserID , NewRole].some(data => data === undefined)){
            return res.status(400).json({success:false , message:"Select a user to alter"})
        }
        //Validate permission
        const Role = await objUserDb.AllModels.roles.findOne({where:{userId:req.user.userId}});
        const RoleDetail = await objUserDb.AllModels.RoleDetails.findOne({where:{RoleID:Role.roleId}});
        const ValidPerm = RoleDetail.Permissions.find(obj => obj?.User || obj);
        if(!ValidPerm == "ALL"){
            return res.status(400).json({success:false , message:"You don't have permission"})
        }
        if(! ValidPerm.find(Per => Per === "Alter" || Per === "ALL")){
            return res.status(400).json({success:false , message:"You don't have permission"})
        }
        const UserRole = await objUserDb.AllModels.roles.findOne({where:{userId:UserID}})

        if(UserRole.roleId >= Role.roleId){
            return res.status(400).json({success:false , message:"Can't alter on same or heigher heirarchy..!"})
        }

        next()

    } catch (error) {
        
    }
}

export const AddRequestTaskValidate = async (req , res , next) => {
    try {
        const {OrganizationName} = req?.body;

        const OrganizationDetails = await objInventoryDataBase.AllModels.organizations.findOne({where:{organizationName:OrganizationName} , raw:true});

        req.body.OrganiationToJoinID = OrganizationDetails.organizationId;

        next()

    } catch (error) {
        
    }
}
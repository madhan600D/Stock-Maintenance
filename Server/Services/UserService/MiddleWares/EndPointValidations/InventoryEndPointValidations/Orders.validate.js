import objInventoryDataBase from "../../../Utils/InventoryDB.js";
import AccessControl from "../../../Class/AccessControl.class.js";
import { ActionEnum , ControlEnum } from "../../../Declarations/PublicEnums.js";
import { Op } from "sequelize";
export const ConfirmOrderValidate = async (req , res , next) => {
    try {
        //0.Declarations
        const {OrderID} = req?.body;
 
        //1.Access control
        const ObjAccessControl = new AccessControl()
        const HasAccess = ObjAccessControl.VerifyAccessControl(req.user.userId , ActionEnum.ALTER , ControlEnum.INVENTORY);
        if(!HasAccess){
            return res.status(400).json({success:false , message:"You don't have permission to confirm order."})
        }

        //2.Order exsits and not yet confirmed
        const OrderData = await objInventoryDataBase.AllModels.Orders.findOne({where:{[Op.and]:[{OrderID:OrderID} , {Active:1}]}})
        if(!OrderData){
            return res.status(400).json({success:false , message:"Mentioned order is not available.Refresh and try again..!"})
        }
        next()
        
    } catch (error) {
     console.log(error)   
    }
}
import { col } from "sequelize";
import { ObjOrder } from "../../Class/Order.class.js";
import objInventoryDataBase from "../../Utils/InventoryDB.js";
import objUserDb from "../../Utils/userDB.js";

export const GetOrders = async (req , res) => {
    try {
        //Declarations
        let DataToClient = {}
        //Database call
        const CurrentOrdersDB = await objInventoryDataBase.AllModels.Orders.findAll({
            include:[
                {
                    model:objInventoryDataBase.AllModels.Vendors,
                    attributes:['VendorName']
                }],
            attributes:['OrderID' ,[col('Vendor.VendorName'), 'VendorName'] , 'OrderDate' , ['OrderJSON', 'OrderData'], 'OrderCost' , ['Active' , 'IsOrderActive']],
            where:{OrganizationID:req.user.organizationId},
            raw:true})

        const OrderHistoryDB = await objInventoryDataBase.AllModels.ConfirmedOrders.findAll({
            include:[
                {
                    model:objInventoryDataBase.AllModels.Vendors,
                    attributes:['VendorName']
                }],
            attributes:['OrderHistoryID',[col('Vendor.VendorName'), 'VendorName'] , 'OrderConfirmDate' , ['OrderJSON', 'OrderData'], 'OrderCost','DaysToDeliver' ],
            where:{OrganizationID:req.user.organizationId},
            raw:true})

        DataToClient.CurrentOrders = CurrentOrdersDB;
        DataToClient.OrderHistory = OrderHistoryDB;

        return res.status(200).json({success:true , data:DataToClient});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:true , message:error});
    }
}
export const PlaceManualOrder = async (req , res) => {
    try {
        const OrgData = await objUserDb.AllModels.organizations.findOne({where:{organizationId:req.user.organizationId}});
        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId} , raw:true});

        const UserData = {userId:req.user.userId , organizationId:req.user.organizationId , userName:req.user.userName , userMail:req.user.userMail , OrganizationName:OrgData.organizationName , RunDate:OrgState.RunDate};
        
        const OrderJSON = req.body.ProductItems , TotalExpense = req.body.TotalCost;


        const {success , message , data} = await ObjOrder.PlaceManualOrder(UserData , OrderJSON , TotalExpense);

        return res.status(success == true ? 200 : 400).json({success:success , message:message , data:data})
    } catch (error) {
        console.log(error) 
        return res.status(500).json({success:false , message:"Server side error while placing a order"});
    }
}

export const ConfirmOrder = async (req , res) => {
    //API:{OrderID}
    try {
        //DB Calls
        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId} , raw:true});

        const OrderData = await objInventoryDataBase.AllModels.Orders.findOne({where:{OrderID:req.body.OrderID}});
        const UserData = {userId:req.user.userId , OrganizationID:req.user.organizationId , RunDate:OrgState.RunDate};

        const HasConfirmed = await ObjOrder.ConfirmOrder(OrderData , UserData);

        return res.status(HasConfirmed.success ? 200 : 400).json({success:HasConfirmed.success , message:HasConfirmed.message , data:HasConfirmed.data ? HasConfirmed.data : ''});
        //TBD: Socket protocol to update online user's state
        
    } catch (error) {
        console.log(error) 
        return res.status(500).json({success:false , message:"Server side error while confirming order"});
    }
}


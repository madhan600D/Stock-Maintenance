import { Op } from "sequelize";
import objInventoryDataBase from "../Utils/InventoryDB.js";

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjUserKafkaProducer } from "../Kafka/Producer/kafkaProducer.js";
import { error } from "console";
class Orders{
    constructor(){
        try {
            this.DataBase = objInventoryDataBase;
            this.ProductToBeOrdered = []
            this.KafkaMessage = {}
            this.ValidationEnum = Object.freeze({
                FILTER_OPEN_ORDERS:"FILTER_OPEN_ORDERS"
            })
        } catch (error) {
            console.log(error)
        }
        
        
    }
    async PlaceOrder(VendorID , OrderData , UserData) {
        try {
            //Reset global variables
            this.ResetClass()

            //Get Vendor Data
            const VendorData = await this.DataBase.AllModels.Vendors.findOne({where:{VendorID:VendorID} ,raw:true});

            //Place orders of products that will be soon breach the reorder threshold.
            this.ClubOrder(VendorID , OrderData , UserData);

            //Filter products that are in running orders.
            this.Validation(this.ValidationEnum.FILTER_OPEN_ORDERS , {OrderData:OrderData , UserData:UserData});

            //Prepare a HTML to send order mail to the vendor.
            const OrderHTML = this.PrepareOrderMailHTML(VendorData.VendorName);

            //Call Kafka and Place Order
            this.KafkaMessage.Event = "SingleMail"
            this.KafkaMessage.Data = {UserMail:VendorData.VendorAPI , UserName:VendorData.VendorName ,Data:{HTML:OrderHTML}}
            await ObjUserKafkaProducer.ProduceEvent("SingleMail" , "user.new_mail.request" , this.KafkaMessage);
            
            return {success:true}

        } catch (error) {
            console.log(error)
        }
    } 
    async PlaceManualOrder(UserData , OrderJSON , TotalExpense){
        //API:{OrderJson}: [{ProductID , ProductName ,Quantity} , {ProductID, ProductName ,Quantity}]
        try {
            //Reset global variables
            this.ResetClass()

            //Prepare the order list
            let [OrderMap , ProductData] = await this.PrepareOrderList(OrderJSON);
            let VendorToProducts = new Map(OrderMap) , OrderDataToClient = [];
            var NewOrder;

            //Construct HTML and call Notification
            for(let [Key , Value] of VendorToProducts){
                const Vendor = Key , Order = Value;
                let TotalExpense = 0;
                const VendorAPI = await objInventoryDataBase.AllModels.Vendors.findOne({where:{VendorName:Vendor}})

                //Prepare HTML
                const OrderHTML = await this.PrepareManualOrderMailHTML(Vendor , Order , UserData.OrganizationName)

                //Call N-service
                this.KafkaMessage.Event = "SingleMail"
                this.KafkaMessage.Data = {UserMail:VendorAPI.VendorAPI , UserName:Vendor ,HTML:OrderHTML , User:VendorAPI.VendorAPI , Subject:"Order details"}
                const IsSuccess = await ObjUserKafkaProducer.ProduceEvent("SingleMail" , "user.new_mail.request" , this.KafkaMessage);

                //DB Updation 
                if(IsSuccess){
                    NewOrder = await objInventoryDataBase.AllModels.Orders.create(
                    {OrganizationID:UserData.organizationId ,
                     VendorID:VendorAPI.VendorID,
                     IsDelivered:false,
                     OrderDate:UserData.RunDate,
                     OrderJSON:Order,
                     OrderCost:TotalExpense,
                     Active:true
                    }
                )
                }
                else{
                    return {success:false , message:"Order placement failed"} 
                }
                const NewOrderStruct = {OrderID:NewOrder.OrderID , VendorName:VendorAPI.VendorName , OrderDate:NewOrder.OrderDate , OrderData:NewOrder.OrderJSON , OrderCost:NewOrder.OrderCost , IsOrderActive:1}

                OrderDataToClient.push(NewOrderStruct)
            }
            return {success:true , message:"Order placed Successfully" , data:OrderDataToClient}
        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
            
        }
    }
    async ConfirmOrder(OrderData , UserData){
        try {
        //0.Declarations
        var Transaction = await objInventoryDataBase.InventoryDB.transaction() , ProductDataToClient = {ProductData:[] , TotalExpense:0};
        //1.Calculate time to deliver
        const TimeToDeliver = this.GetTimeToDeliver(OrderData.OrderDate , UserData.RunDate);

        //2.Move row from orders to confirm order
        const OrderToConfirm = await objInventoryDataBase.AllModels.Orders.findOne({where:{OrderID:OrderData.OrderID}});
        const OrderDataFromDB = OrderToConfirm.get({ plain: true });
        
        await OrderToConfirm.destroy({transaction:Transaction});

        const NewOrderHistory = await objInventoryDataBase.AllModels.ConfirmedOrders.create({
            OrganizationID:UserData.OrganizationID,
            VendorID:OrderDataFromDB.VendorID,
            OrderJSON:OrderDataFromDB.OrderJSON,
            OrderConfirmDate:UserData.RunDate,
            DaysToDeliver:TimeToDeliver,
            OrderCost:OrderDataFromDB.OrderCost,
        } , {transaction:Transaction , returning:true}); 

        //3.Parse OrderJSON and update inventory
        for (const [Key, Value] of Object.entries(OrderDataFromDB.OrderJSON)){
            const [ProductRow , ProductCount] = await objInventoryDataBase.AllModels.Products.increment({Quantity:Value.Quantity} , {where:{ProductID:Value.ProductID} , returning:true , transaction:Transaction});

            ProductDataToClient.ProductData.push({ProductID:ProductRow[0][0].ProductID , Quantity:ProductRow[0][0].Quantity})

            
        }

        //4.PNL increment
        const [NewPNL , PNLCount] = await objInventoryDataBase.AllModels.PNL.increment({TotalExpense:OrderDataFromDB.OrderCost} , 
            {where:{OrganizationID:UserData.OrganizationID} , returning:true , transaction:Transaction});
        
        //5. Attach datas for client
        ProductDataToClient.TotalExpense = NewPNL[0][0].TotalExpense;
        ProductDataToClient.OrderHistory = {OrderHistoryID:NewOrderHistory.OrderHistoryID , OrderConfirmDate:NewOrderHistory.OrderConfirmDate , OrderData:NewOrderHistory.OrderJSON , DaysToDeliver:NewOrderHistory.DaysToDeliver , OrderCost:NewOrderHistory.OrderCost}
        
        
        
        //6.Update Average Lead Time Tracker
            const LeadTimeTrackerData = await objInventoryDataBase.AllModels.LeadTimeTracker.findOne({where:{[Op.and]:[{VendorID:OrderDataFromDB.VendorID , OrganizationID:UserData.OrganizationID}]} , raw:true});

            if(LeadTimeTrackerData){
                //Calculate new average
                const NewAverage = ((LeadTimeTrackerData.AverageLeadTime * LeadTimeTrackerData.NoOfRecords) + TimeToDeliver === 0 ? 1 : TimeToDeliver) / LeadTimeTrackerData.NoOfRecords + 1

                await objInventoryDataBase.AllModels.LeadTimeTracker.update({AverageLeadTime:NewAverage} , {where:{[Op.and]:[{VendorID:OrderDataFromDB.VendorID , OrganizationID:UserData.OrganizationID}]} , transaction:Transaction})
            }
            else{
                //Create new record
                await objInventoryDataBase.AllModels.create({
                    VendorID:OrderDataFromDB.VendorID,
                    OrganizationID:UserData.OrganizationID,
                    AverageLeadTime:TimeToDeliver === 0 ? 1 : TimeToDeliver,
                    NoOfRecords:1
                } , {transaction:Transaction})
            }

        //7.Commit tran
        await Transaction.commit();
        
        return {success:true , message:"Order confirmed successfully" , data: ProductDataToClient};
        } catch (error) {
            await Transaction.rollback();
            console.log(error)
            return {success:false , message:error.message}
        }
    } 
    async PrepareOrderList(OrderJSON){
        try {
            //Decalaration
            let VendorToProducts = new Map(); // {VendorName:[{ProductID , ProductName , Quantity}]}

            const VendorData = await objInventoryDataBase.AllModels.Products.findAll({
            include: [
                {
                model: objInventoryDataBase.AllModels.Vendors,         
                attributes: ['VendorName']
                }
            ],
            where: {
                ProductID: {
                [Op.in]: OrderJSON.map(p => p.ProductID)
                }
            },
            raw:true
            });

            //Combine Products with similar Vendor
            for(let Order of OrderJSON){
                const Vendor = VendorData.find(Data => Data.ProductID == Order.ProductID);

                const ProductList = VendorToProducts.get(Vendor["Vendor.VendorName"]) || [];

                ProductList.push({ProductID:Order.ProductID ,ProductName:Order.ProductName , Quantity:Order.Quantity});

                VendorToProducts.set(Vendor["Vendor.VendorName"] , ProductList);
            }
            return [VendorToProducts , VendorData];
        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
        }
    }
    async PrepareOrderMailHTML(Vendor){
        try { 
            //Import HTML Data
            let OrderHTML = await ImportUserEmailHTML("OrderMailTemplate");
            let OrderRows = ""
            
            //Product Data from DB
            const OrderProducts = await this.DataBase.AllModels.Products.findAll({where:{[Op.in]:{ProductID: this.ProductToBeOrdered}} , raw:true});

            for(let ProductData of OrderProducts){
                OrderRows += `<th>${ProductData.ProductID}</th><th>${ProductData.ProductName}</th><th>Quantity</th>`
                OrderRows += '\n'
            }
            console.log(OrderRows)
            OrderHTML.replace('{OrderData}' , OrderRows);
            return OrderHTML;

        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
        }
    }
    async PrepareManualOrderMailHTML(Vendor , OrderMap , Organization){
        try { 
            //Import HTML Data
            let OrderHTML = await ImportUserEmailHTML("OrderMailTemplate"), OrderRows = "";
            

            for(let OrderData of OrderMap){
                    OrderRows += `<tr>
                            <td>${OrderData.ProductID}</td>
                            <td>${OrderData.ProductName}</td>
                            <td>${OrderData.Quantity}</td>
                        </tr>`;
            }
            //Replace strings in HTML
            OrderHTML = OrderHTML.replace('{OrderData}' , OrderRows); 
            OrderHTML = OrderHTML.replace('{VendorName}' , Vendor)
            OrderHTML = OrderHTML.replace('{OrganizationName}' , Organization)
            return OrderHTML;

        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
        }
    }
    async ClubOrder(VendorID , OrderData , UserData){
        try {
            //HardCoded OrderLimit value
            let MinimumOrderLimit = 10;

            //Add Produt Id to Global variable
            this.ProductToBeOrdered.concat(OrderData);

            //Add products which are just above the threshold.
            const ProductsOfSimilarVendor = await this.DataBase.AllModels.Products.findAll({where:
                {[Op.and]:[{OrganizationID:UserData.organizationId} , {VendorID:VendorID}]} , raw:true});

            for(let Product of ProductsOfSimilarVendor){
                const AwayFromThreshold =  Product.Quantity - Product.ReorderThreshold;
                
                if(AwayFromThreshold <= MinimumOrderLimit){
                    //Add to Products to be placed
                    this.ProductToBeOrdered.push(Product.ProductID)
                }
            }
        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
        }
    }
    async Validation(Type , Payload){
        try {
            if(Type === this.ValidationEnum.FILTER_OPEN_ORDERS){
                //Compare ProductID and if ProductID is already available: Skip order
                const IsPendingOrder = await this.DataBase.AllModels.Orders.findOne({where:{[Op.and]:[{OrganizationID:Payload.UserData.organizationId} , {Active:1}]} , raw:true});

                for(let ProductID of this.ProductToBeOrdered){
                    const IsOrderPlaced = IsPendingOrder.find(Order => Order.OrderJSON.ProductID === ProductID);
                    if(IsOrderPlaced){
                        const OrderIndexInArray = this.ProductToBeOrdered.findIndex(IsOrderPlaced.ProductID);
                        //Remove the product from array
                        this.ProductToBeOrdered.splice(OrderIndexInArray , 1)
                    }
                }
                
            }
        } catch (error) {
            console.log(error)
            return {success:false , message:error.message}
        }

    }
    ResetClass = () => {
        try {
            this.ProductToBeOrdered = []
            this.KafkaMessage = {}
        } catch (error) {
            
        }
    }
    GetTimeToDeliver(OrderDate , ConfirmDate) {
            try {
                const start = new Date(OrderDate);
                const end = new Date(ConfirmDate);

                const diffTime = end - start; 
                const diffDays = diffTime / (1000 * 60 * 60 * 24); 

                return diffDays;
            } catch (error) {
                console.log(error)
            }
        }

}
const ImportUserEmailHTML = async (HTML) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..' ,'Utils',  'HTML', `${HTML}.html`);
    const data = await readFile(filePath , 'utf-8')
    return data;
  } catch (err) {
    console.error('Error reading email template:', err.message);
    return;
  }
};

export const ObjOrder = new Orders();
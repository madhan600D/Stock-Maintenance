import { Op } from "sequelize";
import objInventoryDataBase from "../Utils/InventoryDB.js";

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjUserKafkaProducer } from "../Kafka/Producer/kafkaProducer";
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
            //Get Vendor Data
            const VendorData = await this.DataBase.AllModels.Vendors.findOne({where:{VendorID:VendorID} ,raw:true});

            //Place orders of products that will be soon breach the reorder threshold.
            this.ClubOrder(VendorID , OrderData , UserData);

            //Filter products that are in running orders.
            this.Validation(this.ValidationEnum.FILTER_OPEN_ORDERS , {OrderData:OrderData , UserData:UserData});

            //Prepare a HTML to send order mail to the vendor.
            const OrderHTML = this.PrepareOrderMailHTML();

            //Call Kafka and Place Order
            this.KafkaMessage.Event = "SingleMail"
            this.KafkaMessage.Data = {UserMail:VendorData.VendorAPI , UserName:VendorData.VendorName ,Data:{HTML:OrderHTML}}
            await ObjUserKafkaProducer.ProduceEvent("SingleMail" , "user.new_mail.request" , this.KafkaMessage);
            
            return {success:true}

        } catch (error) {
            console.log(error)
        }
    }
    async PrepareOrderMailHTML(){
        try {
            //Import HTML Data
            let OrderHTML = ImportUserEmailHTML("OrderMailTemplate");
            let OrderRows = ""
            
            //Product Data from DB
            const OrderProducts = await this.DataBase.AllModels.Products.findAll({where:{[Op.in]:{ProductID: this.ProductToBeOrdered}} , raw:true});

            for(let ProductData of OrderProducts){
                OrderRows += `<th>${ProductData.ProductID}</th><th>${ProductData.ProductName}</th><th>Quantity</th>`
                OrderRows += '\n'
            }
            console.log(OrderRows)
            OrderHTML.replace('OrderData' , OrderRows);
            return OrderHTML;

        } catch (error) {
            console.log(error)
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
        }

    }

}
const ImportUserEmailHTML = async (HTML) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname,'/Utils',  'HTML', `${HTML}.html`);
    const data = await readFile(filePath , 'utf-8')
    return data;
  } catch (err) {
    console.error('Error reading email template:', err.message);
    return;
  }
};

export const ObjOrder = new Orders();
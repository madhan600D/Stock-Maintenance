import objInventoryDataBase from "../../Utils/InventoryDB.js";
import { ObjUserKafkaProducer } from "../../Kafka/Producer/kafkaProducer.js";
import { ObjOrder } from "../../Class/Order.class.js";

export const AddCheckOut = async(req , res) => {
    try {
        const {CheckOutDate , ProductItems , NoOfItems , TotalBill} = req?.body;
        //Key:VendorID , Value:ArrayOfProductIDs
        var ProductsToBeOrdered = new Map()
        var Transaction = await objInventoryDataBase.InventoryDB.transaction();
        let KafkaMessage = {} , ReorderProducts = []

        //Update product
        //Syantax Model.decrement('columnName', { by: 1, where: { id: someId } });
        for (let CartProduct of ProductItems){
            const NewQuantity = await objInventoryDataBase.AllModels.Products.decrement('Quantity', {
                                by: CartProduct.Quantity,
                                where: { ProductID: CartProduct.ProductID },
                                returning: true
                                });

            //TBD:Auto Order placement If Threshold breaches, Call Kafka service.Two Mails one to the vendor and one to the admin and add a order data
            
            if(NewQuantity[1][0].Quantity <= NewQuantity[1][0].ReorderThreshold){
                //Add the Product ID as value to VendorID Key.
                ProductsToBeOrdered.set(NewQuantity.VendorID,(ProductsToBeOrdered.get(NewQuantity.VendorID) || []).concat(NewQuantity.ProductID));
            };
        }
        //Update PNL
        await objInventoryDataBase.AllModels.PNL.increment({TotalRevenue:TotalBill});
        
        //Add to Checkout Table
        const NewCheckOut = await objInventoryDataBase.AllModels.CheckOuts.create({
            OrganizationID:organizationId,
            CheckOutDate:CheckOutDate,
            ProductItems:ProductItems,
            TotalCost:TotalBill
        });

        //Place Order of breached items: Iterate Key Value and place order for each vendor
        for(let [Key , Value] of ProductsToBeOrdered){
            ObjOrder.PlaceOrder(Key , Value , req.user)
        }
        await Transaction.commit();
        
        return res.status(200).json({sucess:true , message: ProductsToBeOrdered.size >= 1 ? `Check out processed successfully. and ${ProductsToBeOrdered.size} new orders placed ` : `Check out processed successfully. No new orders placed.`})
    } catch (error) {
        console.log(error);
        await Transaction.rollback();
    }
}




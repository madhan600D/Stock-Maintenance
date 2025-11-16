import objInventoryDataBase from "../../Utils/InventoryDB.js";
import { ObjUserKafkaProducer } from "../../Kafka/Producer/kafkaProducer.js";
import { ObjOrder } from "../../Class/Order.class.js";
import { Json } from "sequelize/lib/utils";
import { Op } from "sequelize";
import Simulation from "../../Class/Simulation.class.js";

export const AddCheckOut = async(req , res) => {
    try {
        const {ProductItems , TotalItems , TotalCost , CheckoutDate} = req?.body;
        //Key:VendorID , Value:ArrayOfProductIDs
        // var ProductsToBeOrdered = new Map()
        var Transaction = await objInventoryDataBase.InventoryDB.transaction();
        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId} , raw:true})
        
        //Update product
        //Syantax Model.decrement('columnName', { by: 1, where: { id: someId } });
        for (let CartProduct of ProductItems){
            const [NewQuantity , NewQuantityRowCount] = await objInventoryDataBase.AllModels.Products.decrement('Quantity', {
                                by: CartProduct.Quantity,
                                where: { ProductID: CartProduct.ProductID },
                                transaction:Transaction,
                                returning: true
                                });
            
            //Update Daily Sales Tracker table
            const ProductSale = await objInventoryDataBase.AllModels.DailyProductSales.findOne({where:{[Op.and]:[{ProductID:CartProduct.ProductID , RunDate : OrgState.RunDate}]} , transaction:Transaction});

            if(ProductSale){
                const [UpdatedSale , RowCount] = await objInventoryDataBase.AllModels.DailyProductSales.increment('SaleQuantity', {
                                by: CartProduct.Quantity,
                                where: {[Op.and]:[{ProductID:CartProduct.ProductID , RunDate : OrgState.RunDate}]},
                                transaction:Transaction,
                                returning: true
                                });
            }
            else{
                const NewSale = await objInventoryDataBase.AllModels.DailyProductSales.create({
                    ProductID:CartProduct.ProductID,
                    RunDate:OrgState.RunDate,
                    SaleQuantity:CartProduct.Quantity,
                    OrganizationID:req.user.organizationId
                } , {transaction:Transaction})
            }

            // //Simulate and Get LTD-> LTD < Quantity = PlaceOrder()
            // const ObjSimulation  = new Simulation(NewQuantity[0][0] , objInventoryDataBase);
            // const LTDofProduct = await ObjSimulation.ForecastDemand(Transaction) 
            
            // if(NewQuantity[0][0].Quantity <= LTDofProduct.data){
            //     //Add the Product ID as value to VendorID Key.
            //     ProductsToBeOrdered.set(NewQuantity.VendorID,(ProductsToBeOrdered.get(NewQuantity.VendorID) || []).concat(NewQuantity.ProductID));
            // };
        }

        // Update PNL
        const [PNLUpdate , AffectedRows] = await objInventoryDataBase.AllModels.PNL.increment(
                                { TotalRevenue: TotalCost },
                                { where: { OrganizationID: req.user.organizationId },
                                transaction:Transaction, 
                                returning: true });
        
        //Add to Checkout Table
        const NewCheckOut = await objInventoryDataBase.AllModels.CheckOuts.create({
            OrganizationID:req.user.organizationId,
            CheckOutDate:CheckoutDate,
            NoOfItems:TotalItems,
            ProductItems:ProductItems,
            TotalCost:TotalCost
            } , {transaction:Transaction});

        //Place Order of breached items: Iterate Key Value and place order for each vendor
        // for(let [Key , Value] of ProductsToBeOrdered){
        //     ObjOrder.PlaceOrder(Key , Value , req.user)
        // }
        
        const DataToClient = {
            NewCheckOut:NewCheckOut,
            NewPNL:PNLUpdate[0][0],
            NewProduct:NewQuantity[0][0]
        }
        await Transaction.commit();



        return res.status(200).json({sucess:true , message: 'Checkout placed successfully.'})
    } catch (error) {
        console.log(error);
        await Transaction.rollback();
    }
}

export const GetCurrentDayCheckout = async (req , res) => {
    try {
        //High selling product , High profited products
        let clientData = {} , MergedCheckouts = [];
        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId}});
        const CurrentDayCheckoutArray = await objInventoryDataBase.AllModels.CheckOuts.findAll({
            where:{OrganizationID:req.user.organizationId },
        });
        let Checkouts = CurrentDayCheckoutArray.map((Checkout) => (Checkout.ProductItems));
        //Flat out into single array
        Checkouts = Checkouts.flat()

        //Merge by produtID
        for (let Check of Checkouts){
            let MergedCheckoutIndex = -1;
            MergedCheckoutIndex = MergedCheckouts?.findIndex(C => C.ProductID === Check.ProductID)
            if(MergedCheckouts.length >= 1 && MergedCheckoutIndex !== -1){
                //Merging Logic
                MergedCheckouts[MergedCheckoutIndex].Quantity += Check.Quantity;
                MergedCheckouts[MergedCheckoutIndex].Price += Check.Price
            }
            else{
                MergedCheckouts.push({...Check});
            }
        }
    
        clientData.MostSellingProducts = MergedCheckouts.sort((a , b) => b.Quantity - a.Quantity);

        // console.log('Most seller from server' , clientData) 

        return res.status(200).json({success:true , data:clientData});
        
    } catch (error) {
        console.log(error)
    }
}


export const GetCheckOuts = async (req , res) => {
    try {
        const Checkouts = await objInventoryDataBase.AllModels.CheckOuts.findAll({
            where:{OrganizationID:req.user.organizationId},
            attributes:['CheckOutID' , 'CheckOutDate' , 'TotalCost'],
            raw:true
        })

        return res.status(200).json({success:true , data:Checkouts});
        
    } catch (error) {
        console.log(error)
    }
}
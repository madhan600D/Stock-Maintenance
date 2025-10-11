import AccessControl from "../../../Class/AccessControl.class.js";
import objInventoryDataBase from "../../../Utils/InventoryDB.js"

import { Op } from "sequelize";

export const AddCheckOutValidate = async (req , res , next) => {
    try {
        const {CheckOutDate , NoOfItems , ProductItems} = req?.body;
        //Field Sanitization

        //Check OutDate Validation
        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId} , raw:true});

        if(OrgState.RunDate !== CheckOutDate){
            return res.status(400).json({success:false , message:"Check out time should be same as rundate"})
        }
        //ProductItems validations
        const ProductIDArrayFromClient = ProductItems.map((Product) => (Product.ProductID));
        const ProductFromDB = await objInventoryDataBase.AllModels.Products.findAll({where:{[Op.in]:ProductIDArrayFromClient} , raw:true});

        for(let ProductID of ProductIDArrayFromClient){
            if(!ProductFromDB.find(Prod => Prod === ProductID)){
                return res.status(400).json({success:false , message:`${ProductID} Product ID not available`})
            }
            const DBProduct = ProductFromDB.find(prod => prod.ProductID === ProductID);
            const CartProduct = ProductItems.find(prod => prod.ProductID === ProductID);

            if (DBProduct && CartProduct && DBProduct.Quantity < CartProduct.Quantity) {
                return res.status(400).json({success:false , message:"Cart quantity exceeds total available quantity, Refresh and add checkout again or reduce the quamtity."})
            }
        }

        next()


    } catch (error) {
        console.log(error)
    }
}
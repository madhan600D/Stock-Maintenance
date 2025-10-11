
import AccessControl from "../../../Class/AccessControl.class.js";
import objInventoryDataBase from "../../../Utils/InventoryDB.js"

import { Op } from "sequelize";
export const AddProductValidate = async (req , res , next) => {
    try { 
        const {ProductName , ProductImage , ProductPrice, Quantity, CurrencyName, CategoryName, Unit, VendorName, ExpirationDate, ReorderThreshold , ActualPrice} = req?.body;

        if([ProductName , ProductImage , ProductPrice, Quantity, CurrencyName, CategoryName, Unit, VendorName, ExpirationDate, ReorderThreshold ,ActualPrice].some(Element => Element === undefined)){
            return res.status(400).json({success:false , message:"Please fill all the required product fields...!"})
        }

        const IsProductsExists = await objInventoryDataBase.AllModels.Products.findOne({
            where:{[Op.and]:[{OrganizationID:req.user.organizationId} , {ProductName:ProductName}]}
        })

        if(IsProductsExists){ 
            return res.status(400).json({success:false , message:"Product already exists ...!"})
        }

        //Date validation
        const CurrentDate = new Date();
        if(ExpirationDate <= CurrentDate.toLocaleDateString()){
            return res.status(400).json({success:false , message:"Product expiration date cannot be less than current date"})
        }
        //Access Validations
        const ObjAccessControl = new AccessControl()
        const HasAccess = await ObjAccessControl.VerifyAccessControl(req.user.userId , "ADD" , "Inventory")

        if(!HasAccess){
            return res.status(400).json({success:false , message:"You're not authorized to do this action."})
        }

        next();
    } catch (error) {
        console.log("Error at add product validation")
        return res.status(500).json({success:false , message:"Server side error at prodict validation "})
    }
}

export const AlterProductValidate = async (req , res , next) => {
    try { 
        const {UpdateKeyValue, ProductID} = req?.body;   
 
        if([UpdateKeyValue, ProductID].some(Element => Element == undefined)){ 
            return res.status(400).json({success:false , message:"Please fill/select required data ...!"})
        }
        //Verify user permission
        const ObjAccessControl = new AccessControl()
        const HasAccess = await ObjAccessControl.VerifyAccessControl(req.user.userId , "Alter" , "Inventory")

        if(!HasAccess){
            return res.status(400).json({success:false , message:"You're not authorized to do this action."})
        }
        next()
    } catch (error) {
        return res.status(500).json({success:false , message:"Server side error while Altering product."})
    }
}

export const DeleteProductValidate = async (req , res , next) => {
    try {
        const {ProductIDs} = req?.body;
        if(!ProductIDs){
            return res.status(400).json({success:false , message:"Please select atleast one product to remove ...!"})
        }
        const AllProducts = await objInventoryDataBase.AllModels.Products.findAll({
                        where: {
                            ProductId: {
                            [Op.in]: [...ProductIDs]
                            }
                        }
        });

        if(AllProducts.length !== ProductIDs.length){
            return res.status(400).json({success:false , message:"One or more selected products is not available, Please refresh and try again"})
        }
        next()
    } catch (error) {
        
    }

}

export const AddCategoryValidation = async (req , res , next) => {
    //Field validation
    const {CategoryName , CategoryDescription} = req?.body;

    if([CategoryName , CategoryDescription].some(Element => undefined)){
        return res.status(400).json({success:false , message:"Please fill all fields ..!"})
    }

    //Verify Duplicate
    const Category = await objInventoryDataBase.AllModels.Category.findOne({where:{CategoryName:CategoryName}})
    if(Category){
        return res.status(400).json({success:false , message:"Sorry, Category already exsists."})
    }

    //Verify user permission
    const ObjAccessControl = new AccessControl()
    const HasAccess = await ObjAccessControl.VerifyAccessControl(req.user.userId , "Add" , "Inventory")

    if(!HasAccess){
        return res.status(400).json({success:false , message:"Sorry, You don't have access for this action"})
    }

    next()

}
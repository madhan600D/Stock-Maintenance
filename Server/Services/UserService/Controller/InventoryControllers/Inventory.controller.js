import { Op } from "sequelize";
import objInventoryDataBase from "../../Utils/InventoryDB.js";

import cloudinary from "../../Lib/Cloudinary.js";

export const GetProductsForOrganization = async (req , res) => {
    try {
        const { OrgID , CatID  } = req.query; 

        if (!OrgID || !CatID) {
            return res.status(400).json({success:false , message: "orgId or categoryID is required" });
        }

        if(CatID == 0 ){
            //Get All products
            const AllProducts = await objInventoryDataBase.allModels.Products.findAll({where:{OrganizationID:OrgID}});
            return res.status(200).json({success:true , data: AllProducts});
        }
        else{
            //Get products for mentioned category
            const ProductsPerCategory = await objInventoryDataBase.allModels.Products.findAll(
                {
                    where:{[Op.and]:[{OrganizationID:OrgID} , {CategoryID:CatID}]}
                        
                });
            return res.status(200).json({success:true , data: ProductsPerCategory});
        }
    } catch (error) {
        
    }
}

export const AddProductForOrganization = async (req , res) => {
    try {
        const Transaction = await objInventoryDataBase.InventoryDB.transaction()
        const {ProductName , ProductImage , ProductPrice, ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold} = req.body;

        const IsCategoryExsists = await objInventoryDataBase.allModels.Category.findOne({
                where:{[Op.and]:[{OrganizationID:req.user.OrgID} , {CategoryName:CategoryName}]}
            });

        //Add new category to DB
        let NewCategory
        //TBD:Handle category image upload
        !IsCategoryExsists ? NewCategory  = await objInventoryDataBase.allModels.Category.create({OrganizationID:req.user.OrgID, CategoryName:CategoryName, CategoryDescription:'' , CategoryImage:''}) : ''
        
        if(ProductImage){
            var CloudinaryResponse = await cloudinary.uploader.upload(image);
        }
        
        //Add the product
        const NewProduct = await objInventoryDataBase.allModels.Products.create({OrganizationID:req.user.OrgID,     ProductName:ProductName, ProductPrice:ProductPrice, ActualPrice:ProductPrice, CategoryID:!IsCategoryExsists ? NewCategory.CategoryID : IsCategoryExsists.CategoryID, ProductImage:CloudinaryResponse.secure_url, VendorID:Vendor, IsExpired:false, ExpirationDate:ExpirationDate,ReorderThreshold:ReorderThreshold, Unit:Unit, Quantity:ProductQuantity , Currency:Currency} , {Transaction});

        return res.status(200).json({success:true , message:"Product and category created successfully ...!" , data:[NewProduct , NewCategory]})

    } catch (error) {
        
    }
}

export const GetCategoryForOrganization = async (req , res) => {
    try {
        const {OrgID} = req?.query;

        const AllCategories = await objInventoryDataBase.allModels.Category.findAll({where:{
                                    [Op.or]:[{OrgID:1} , {OrgID:OrgID}]}})
        return res.status(200).json({success:true , data:AllCategories})

        
    } catch (error) {
        
    }
}

export const AlterProductForOrganization = async (req , res) => {
    try {
        const {Key , Value , ProductID} = req?.body;

        //Dynamically updating the product based on UserValue
        const UpdatedProduct = await objInventoryDataBase.allModels.Products.update({[Key] : Value} , {where:{ProductID:ProductID}});

        return res.status(200).json({success:true , message:`Updated ${UpdatedProduct.ProductName}'s ${Key} successfully ...!` , data:UpdatedProduct});
        

        
    } catch (error) {
        
    }
}
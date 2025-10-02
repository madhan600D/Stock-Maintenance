import { Op, Transaction } from "sequelize";
import objInventoryDataBase from "../../Utils/InventoryDB.js";

import cloudinary from "../../Lib/Cloudinary.js";
import objUserDb from "../../Utils/userDB.js";


export const GetProductsForOrganization = async (req , res) => {
    try {
        const {CatID } = req.query; 

        if (!CatID) {
            return res.status(400).json({success:false , message: "CategoryID is required" });
        }

        if(CatID == 0 ){
            //Get All products
            const AllProducts = await objInventoryDataBase.AllModels.Products.findAll({where:{OrganizationID:req.user.organizationId} , raw:true});
            return res.status(200).json({success:true , data: AllProducts});
        }
        else{
            //Get products for mentioned category
            const ProductsPerCategory = await objInventoryDataBase.AllModels.Products.findAll(
                {
                    where:{[Op.and]:[{OrganizationID:req.user.organizationId} , {CategoryID:CatID}]},
                    raw:true    
                });
            return res.status(200).json({success:true , data: ProductsPerCategory});
        }
    } catch (error) {
        console.log(error)
    }
}

export const AddProductForOrganization = async (req , res) => {
    try {
        const Transaction = await objInventoryDataBase.InventoryDB.transaction()
        const {ProductName , ProductImage , ProductPrice, ActualPrice , ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold} = req.body;

        const IsCategoryExsists = await objInventoryDataBase.allModels.Category.findOne({
                where:{[Op.and]:[{OrganizationID:req.user.OrgID} , {CategoryName:CategoryName}]}
            });

        //Add new category to DB
        let NewCategory
        //TBD:Handle category image upload
        !IsCategoryExsists ? NewCategory  = await objInventoryDataBase.allModels.Category.create({OrganizationID:req.user.OrgID, CategoryName:CategoryName, CategoryDescription:'' , CategoryImage:''}) : ''
        
        if(ProductImage){
            var CloudinaryResponse = await cloudinary.uploader.upload(ProductImage);
        }

        if(!CloudinaryResponse){
            CloudinaryResponse = ''
        }
        
        //Add the product
        const NewProduct = await objInventoryDataBase.allModels.Products.create({OrganizationID:req.user.organizationId,ProductName:ProductName, ProductPrice:ProductPrice, ActualPrice:ActualPrice, CategoryID:!IsCategoryExsists ? NewCategory.CategoryID : IsCategoryExsists.CategoryID, ProductImage:CloudinaryResponse.secure_url, VendorID:Vendor, IsExpired:false, ExpirationDate:ExpirationDate,ReorderThreshold:ReorderThreshold, Unit:Unit, Quantity:ProductQuantity , Currency:Currency} , {Transaction});

        const ProductExpense = ActualPrice * ProductQuantity

        //Update PNL using increment
        const NewPNL = await objInventoryDataBase.AllModels.PNL.increment(
                            { TotalRevenue: ProductExpense },
                            { where: { OrganizationID: req.user.organizationId }});

        return res.status(200).json({success:true , message:"Product and category created successfully ...!" , data:{PNL:NewPNL , NewProduct:NewProduct}})

    } catch (error) {
        console.log("Error while adding products");
        await Transaction.rollback();
    }
}

export const GetCategoryForOrganization = async (req , res) => {
    try {

        const AllCategories = await objInventoryDataBase.AllModels.Category.findAll({where:{
                                    [Op.or]:[{OrganizationID:1} , {OrganizationID:req.user.organizationId}]} ,attributes:['CategoryID' , 'CategoryName' , 'CategoryDescription'] ,
                                    raw:true})
                                    
        return res.status(200).json({success:true , data:AllCategories})

        
    } catch (error) { 
        console.log(error)
    }
}

export const AddCategoryForOrganization = async (req , res) => {
    try {
        const Transaction =  await objInventoryDataBase.InventoryDB.transaction()

        const {CategoryName , CategoryDescription , CategoryImage} = req?.body;

        if(CategoryImage){
            var CloudinaryResponse = await cloudinary.uploader.upload(CategoryImage);
        }

        if(!CloudinaryResponse){
            CloudinaryResponse = ''
        } 

        //Add to category table
        const NewCategory = await objInventoryDataBase.AllModels.Category.create({
            CategoryName:CategoryName,
            CategoryImage:CloudinaryResponse,
            CategoryDescription:CategoryDescription,
            OrganizationID:req.user.organizationId
        } , {transaction:Transaction})

        await Transaction.commit();

        return res.status(200).json({success:true , data:{CategoryID:NewCategory.CategoryID ,CategoryName:NewCategory.CategoryName , CategoryDescription:NewCategory.CategoryDescription}})


    } catch (error) { 
        console.log("Error while adding category")
        await Transaction.rollback()
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

export const DeleteProducts = async (req , res) => {
    try {
        const Transaction = await objUserDb.userDB.transaction()
        const NewProductList = await objUserDb.allModels.Products.delete({where:{
            [Op.in] : [req.body.ProductIDs]
        } , transaction:Transaction});

        await Transaction.commit()
        return res.status(200).json({success:true , message:"Products removed successfully" , data:NewProductList})
    } catch (error) {
        await Transaction.rollback()
    }
}
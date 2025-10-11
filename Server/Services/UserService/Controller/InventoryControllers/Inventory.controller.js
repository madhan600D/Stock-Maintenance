import { Op, Transaction, where } from "sequelize";
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
        const {ProductName , ProductImage , ProductPrice, ActualPrice , Quantity, CurrencyName, CategoryName, Unit, VendorName, ExpirationDate, ReorderThreshold} = req.body;



        const Currency = await objInventoryDataBase.AllModels.Currency.findOne({where:{CurrencyName:CurrencyName} , attributes:['CurrencyID'] , raw:true});

        const Vendor = await objInventoryDataBase.AllModels.Vendors.findOne({where:{VendorName:VendorName} , attributes:['VendorID'] , raw:true});


        const IsCategoryExsists = await objInventoryDataBase.AllModels.Category.findOne({
                where:{[Op.and]:[{OrganizationID:req.user.organizationId} , {CategoryName:CategoryName}]}
        });

        //Add new category to DB
        let NewCategory
        //TBD:Handle category image upload
        !IsCategoryExsists ? NewCategory  = await objInventoryDataBase.AllModels.Category.create({OrganizationID:req.user.OrgID, CategoryName:CategoryName, CategoryDescription:'' , CategoryImage:''}) : ''
        
        if(ProductImage){
            var CloudinaryResponse = await cloudinary.uploader.upload(ProductImage);
        }

        if(!CloudinaryResponse){
            CloudinaryResponse = ''
        }
        
        //Add the product
        const NewProduct = await objInventoryDataBase.AllModels.Products.create({OrganizationID:req.user.organizationId,ProductName:ProductName, ProductPrice:ProductPrice, ActualPrice:ActualPrice, CategoryID:!IsCategoryExsists ? NewCategory.CategoryID : IsCategoryExsists.CategoryID, ProductImage:CloudinaryResponse.secure_url, VendorID:Vendor.VendorID, IsExpired:false, ExpirationDate:ExpirationDate,ReorderThreshold:ReorderThreshold, Unit:Unit, Quantity:Quantity , CurrencyID:Currency.CurrencyID} , {returning: ['ProductID', 'ProductName', 'Quantity' , 'ProductPrice'] , 
        Transaction});

        const ProductExpense = ActualPrice * Quantity;  

        // Update PNL
        const [PNLUpdate] = await objInventoryDataBase.AllModels.PNL.increment(
                                { TotalExpense: ProductExpense },
                                { where: { OrganizationID: req.user.organizationId }, returning: true });
        
        //Prepare Client Data
        const RawClientData = {ProductData: {ProductID:NewProduct.ProductID , ProductName:ProductName , ProductPrice:NewProduct.ProductPrice}, PNLData: PNLUpdate[0][0]};
 
        return res.status(200).json({success:true , message:"Product and category created successfully ...!" , data:RawClientData})

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
        var Transaction = await objInventoryDataBase.InventoryDB.transaction();
        let ClientData = {};
        let {UpdateKeyValue , ProductID} = req?.body;

        UpdateKeyValue = new Map(Object.entries(UpdateKeyValue))
        //Get Product Data
        const ProductData = await objInventoryDataBase.AllModels.Products.findOne({where:{ProductID:ProductID}})
        //Update product with validation
        for(let [Key , Value] of UpdateKeyValue){
            if(Key === "ProductImage"){
                var CloudinaryResponse = await cloudinary.uploader.upload(Value);
                UpdateKeyValue.set("ProductImage" , CloudinaryResponse.secure_url)
            }
            if(Key === "ProductPrice"){
                if(ProductData.ActualPrice > Value){
                    res.status(400).json({success:false , message:"New price cannot be less than actual price"})
                }
            }
            if(Key === "Quantity"){
                // const CurrentExpense = await objInventoryDataBase.AllModels.PNL.findOne({where:{OrganizationID:req.user.organizationId}});
                let AddingExpense = ProductData.ProductPrice * Value
                var [PNLUpdate] = await objInventoryDataBase.AllModels.PNL.increment(
                                { TotalExpense: AddingExpense },
                                { where: { OrganizationID: req.user.organizationId }, returning: true  , Transaction:Transaction});
                ClientData.NewPNL = PNLUpdate[0][0]
            }
        }
        
        
        //Dynamically updating the product based on UserValue
        UpdateKeyValue = Object.fromEntries(UpdateKeyValue)
        await objInventoryDataBase.AllModels.Products.update(UpdateKeyValue, {where:{ProductID:ProductID} , Transaction:Transaction , raw:true});

        const UpdatedProduct = await objInventoryDataBase.AllModels.Products.findOne({where:{ProductID:ProductID} , raw:true});
        //Set ClientData
        ClientData.NewProduct = UpdatedProduct
        
        await Transaction.commit() 
        return res.status(200).json({success:true , message:`Updated ${UpdatedProduct.ProductName} successfully ...!` , data:ClientData});
        

        
    } catch (error) {
        console.log("Server side error while updating" , error);
        await Transaction.rollback()
        
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

export const GetCurrency = async (req , res) => {
    try {
        const Currency = await objInventoryDataBase.AllModels.Currency.findAll({raw:true , attributes:['CurrencyID' , 'CurrencyName']})
        return res.status(200).json({success:true , message:"Products removed successfully" , data:Currency})
    } catch (error) {
        console.log("Failed to get currency")
    }
}
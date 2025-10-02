
import AccessControl from "../../../Class/AccessControl.class.js";
import objInventoryDataBase from "../../../Utils/InventoryDB.js"
export const AddProductValidate = async (req , res , next) => {
    try {
        const {ProductName , ProductImage , ProductPrice, ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold , ActualPrice} = req?.body;

        if([ProductName , ProductImage , ProductPrice, ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold ,ActualPrice].some(Element => Element === undefined)){
            return res.status(400).json({success:false , message:"Please fill all the required product fields...!"})
        }

        //If 
        const IsProductsExists = await objInventoryDataBase.allModels.Products.findOne({
            where:{[Op.and]:[{OrganizationID:req.validate.OrgID} , {ProductName:ProductName}]}
        })

        if(IsProductsExists){
            return res.status(400).json({success:false , message:"Product already exists ...!"})
        }

        next();
    } catch (error) {
        
    }
}

export const AlterProductValidate = async (req , res , next) => {
    try {
        const {Key , Value , ProductID} = req?.body;

        if([Key , Value , ProductID].some(Element === undefined)){
            return res.status(400).json({success:false , message:"Please fill/select required data ...!"})
        }
        next()
    } catch (error) {
        
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
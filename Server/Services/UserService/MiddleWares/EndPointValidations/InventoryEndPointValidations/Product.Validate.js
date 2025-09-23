
import objInventoryDataBase from "../../../Utils/InventoryDB.js"
export const AddProductValidate = async (req , res , next) => {
    try {
        const {ProductName , ProductImage , ProductPrice, ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold} = req?.body;

        if([ProductName , ProductImage , ProductPrice, ProductQuantity, Currency, CategoryName, Unit, Vendor, ExpirationDate, ReorderThreshold].some(Element => Element === undefined)){
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
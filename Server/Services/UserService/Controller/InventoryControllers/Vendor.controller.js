import objInventoryDataBase from "../../Utils/InventoryDB.js";



export const GetVendor = async (req , res) => {
    try {
        const Vendors = await objInventoryDataBase.AllModels.Vendors.findAll({attributes:['VendorID','VendorName' , 'VendorAPI'],raw:true})
        if(!Vendors){
            return res.status(400).json({success:false , message:"No vendors available in system, Please add one"});
        }

        return res.status(200).json({success:true , data: Vendors});
    } catch (error) {
        
    }
}
export const AddVendor = async (req , res) => {
    try {
        var Transaction = await objInventoryDataBase.InventoryDB.transaction();
        
        const {VendorName , VendorLocation , VendorAPIType , VendorAPI} = req?.body;

        const NewVendor = await objInventoryDataBase.AllModels.Vendors.create({
            VendorName:VendorName,
            VendorLocation:VendorLocation,
            API_Email:VendorAPIType,
            VendorAPI:VendorAPI
        });
        const RawData = NewVendor.get({ plain: true });
        await Transaction.commit();

        return res.status(200).json({success:true , data:RawData});

    } catch (error) {
        await Transaction.rollback()
        console.log(error)
        return res.status(500).json({success:false , message:"Server side error while adding, NewVendor"});
    }
}
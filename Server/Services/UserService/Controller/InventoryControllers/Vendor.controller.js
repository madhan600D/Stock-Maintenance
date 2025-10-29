import objInventoryDataBase from "../../Utils/InventoryDB.js";
import { ObjUserKafkaProducer } from "../../Kafka/Producer/kafkaProducer.js";


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
        let KafkaMessage = {}
        
        const {VendorName , VendorLocation , VendorAPIType , VendorAPI} = req?.body;

        const NewVendor = await objInventoryDataBase.AllModels.Vendors.create({
            VendorName:VendorName,
            VendorLocation:VendorLocation,
            API_Email:VendorAPIType,
            VendorAPI:VendorAPI
        } , {transaction:Transaction});
        const RawData = NewVendor.get({ plain: true });
        
        //Call Notification Service and create new user
        KafkaMessage.Event = "CreateExternalUser"
        KafkaMessage.Data = {UserMail:NewVendor.VendorAPI , UserName:VendorName}
        var IsSuccess = await ObjUserKafkaProducer.ProduceEvent("CreateExternalUser" , "user.create_user.request" , KafkaMessage);
        if(IsSuccess){
            await Transaction.commit();
            return res.status(200).json({success:true , data:RawData}); 
        }
        else{
            await Transaction.rollback();
            return res.status(200).json({success:false , message:"Vendor creation failed (Server)"});
        }
    } catch (error) {
        await Transaction.rollback()
        console.log(error)
        return res.status(500).json({success:false , message:"Server side error while adding, NewVendor"});
    }
}
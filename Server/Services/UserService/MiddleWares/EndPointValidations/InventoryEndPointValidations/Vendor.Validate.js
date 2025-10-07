import AccessControl from "../../../Class/AccessControl.class.js";
import objInventoryDataBase from "../../../Utils/InventoryDB.js";


export const AddVendorValidate = async (req , res , next) => {
    try {
        const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const {VendorName , VendorLocation , VendorAPIType , VendorAPI} = req?.body;

        //Field Validation 
        if([VendorName , VendorLocation , VendorAPIType , VendorAPI].some(Var => undefined)){
            return res.status(400).json({success:false , message:"Please fill all the fields"})
        }

        //AccessControl
        const ObjAccessControl = new AccessControl()
        const HasAccess = await ObjAccessControl.VerifyAccessControl(req.user.userId , "ADD" , "Inventory")

        if(!HasAccess){
            return res.status(400).json({success:false , message:"You're not authorized to do this action."})
        }
        //Regex verification
        let IsRegexSuccess;
        if(VendorAPIType == "EMAIL"){
            IsRegexSuccess = EmailRegex.test(VendorAPI)
            if(!IsRegexSuccess){
                return res.status(400).json({success:false , message:"Provided API is invalid"});
            }
        }

        //Duplicate validation
        const IsTaken = await objInventoryDataBase.AllModels.Vendors.findOne({where:{VendorName:VendorName}});
        if(IsTaken){
            return {success:false , message: "Vendor exsists..!"}
        }

        next();


    } catch (error) {
        return res.status(500).json({success:false , message:"Adding vendor failed at server side"})
    }
}
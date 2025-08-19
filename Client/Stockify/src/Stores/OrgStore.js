import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
const useOrg = create((set , get) => ({
    IsCreateOrgLoading:false,
    OrganizationData:{},
    CreateOrg : async (OrgData) => {
        set({IsNewOrgLoading:true});
        try {
            const IsSuccess = await Validate("CreateOrg" , OrgData);
            if(!IsSuccess.success){
                return {success:false , message:IsSuccess.message}
            }
            const res = await AxiosInstance.put('./api/userservice/org/create-org' , OrgData);
            //NewOrg Data
            const DataFromBackend = res.data.data;
            set({OrganizationData:{OrganizationName:DataFromBackend.organizationName , OrganizationID: DataFromBackend.organizationId , OrganizationJoiningCode: DataFromBackend.OrganizationJoiningCode}});
            return {success:true , message:`Congratulations on creating ${DataFromBackend.organizationName} ...!`}
        } catch (error) {
            return {success:false , message:DataFromBackend.data?.message || error.response.data.message || "Error while creating new organization ...!"}
        }
    }
}))

const Validate = async (ValidationType , Data) => {
    try {
        if(ValidationType === "CreateOrg"){
            const {OrganizationName , BusinessType , Street , City , Country , PinCode} = Data;
            if([OrganizationName , BusinessType , Street , City , Country , PinCode].some(Value => Value === undefined)){
                return {success:false , message:"Please fill all fields ...!"}
            }
            return {success:true , message:"Validation Done ...!"}
        }
    } catch (error) {
        return {success:false , message:"Error at organization validation ...!"}
        console.log(error.message)
    }

}


export default useOrg;
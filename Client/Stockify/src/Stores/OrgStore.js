import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
const useOrg = create((set , get) => ({
    IsCreateOrgLoading:false,
    IsJoiningOrg:false,
    IsBulkMailLoading : false,
    OrganizationData:{},
    AllOrganizations:[],
    CreateOrg : async (OrgData) => {
        set({IsNewOrgLoading:true});
        try {
            const IsSuccess = await Validate("CreateOrg" , OrgData);
            if(!IsSuccess.success){
                return {success:false , message:IsSuccess.message}
            }
            const res = await AxiosInstance.put('/api/userservice/org/create-org' , OrgData);
            //NewOrg Data
            const DataFromBackend = res.data.data;
            set({OrganizationData:{OrganizationName:DataFromBackend.organizationName , OrganizationID: DataFromBackend.organizationId , OrganizationJoiningCode: DataFromBackend.OrganizationJoiningCode}});
            return {success:true , message:`Congratulations on creating ${DataFromBackend.organizationName} ...!`}
        } catch (error) {
            return {success:false , message:DataFromBackend.data?.message || error.response.data.message || "Error while creating new organization ...!"}
        }
    },
    JoinOrg: async (OrgData) => {
        set({IsJoiningOrg:true})
        try {
            const Validation = await Validate("JoinOrg" , OrgData)
            if(!Validation.success){
                return {success:false , message:Validation?.message}
            }

            const res = await AxiosInstance.put('/api/userservice/org/join-org' , OrgData);
            const DataFromBackend = res.data.data;
            set({OrganizationData:{OrganizationName:DataFromBackend.organizationName , OrganizationID: DataFromBackend.organizationId}});
            return {success:true , message:`Congratulations on Joining ${DataFromBackend.organizationName} ...! ,Explore Home page to find more about your Organization`}
        } catch (error) {
            
        }
        finally{
            set({IsJoiningOrg:false})
        }
    },
    GetAllOrganizations: async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/org/get-organizations');
            const DataFromBackEnd = res.data.data
            set({AllOrganizations:DataFromBackEnd.map(Value => Value.organizationName)})
        } catch (error) {
            return {success:false , message:"Server side error (Front End)...!"}
        }
    },
    GroupInviteToOrg : async (UserData) => {
        set({IsBulkMailLoading :true})
        try {
            const Validation = Validate("GroupInviteToOrg" , UserData)

            if(!Validation.success){
                return {success:false , message:"Group invitation validation failed ...!"}
            }
            let DataToBackEnd = {GroupOfUsers:''}
            DataToBackEnd.GroupOfUsers =  UserData.map(Item => Item?.ItemData)
            const res = await AxiosInstance.put('/api/userservice/org/group-invite-mail' , DataToBackEnd);
            const DataFromBackEnd = res.body
            return DataFromBackEnd;
        } catch (error) {
            return {success:false , message:"Server side error (Front End)...!"}
        }
        finally{
            set({IsBulkMailLoading :false})
        }
    }
}))

const Validate =  (ValidationType , Data) => {
    try {
        if(ValidationType === "CreateOrg"){
            const {OrganizationName , BusinessType , Street , City , Country , PinCode} = Data;
            if([OrganizationName , BusinessType , Street , City , Country , PinCode].some(Value => Value === undefined)){
                return {success:false , message:"Please fill all fields ...!"}
            }
            return {success:true , message:"Validation Done ...!"}
        }
        else if(ValidationType == "JoinOrg"){
            if(Data?.JoinMethod == "referral"){
                const {OrganizationJoiningCode} = Data ; 
                if(OrganizationJoiningCode.toString().length > 8){
                    return {success:false , message:"Org code should be 6 digits...!"}
                }
                return {success:true}
            }
        }
        else if(ValidationType == "GroupInviteToOrg"){
            if(!Data){
                return {success:false}
            }
            if(Data.length < 1){
                return {success:false}
            }
            return {success:true}
        }
    } catch (error) {
        return {success:false , message:"Error at organization validation ...!"}
        console.log(error.message)
    }

}


export default useOrg;
import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
const useOrg = create((set , get) => ({
    IsNewOrgLoading:false,
    IsJoiningOrg:false,
    IsBulkMailLoading : false,
    IsClosingDay:true,
    OrganizationData:{},
    AllOrganizations:[],
    CreateOrg : async (OrgData) => {
        set({IsNewOrgLoading:true});
        let DataFromBackend , ObjError = {success:true , message:''}
        try {
            const IsSuccess = await Validate("CreateOrg" , OrgData);
            if(!IsSuccess.success){
                return {success:false , message:IsSuccess.message}
            }
            const res = await AxiosInstance.put('/api/userservice/org/create-org' , OrgData);

            //NewOrg Data
            DataFromBackend  = res.data.data;

            //Set Global org state
            set({OrganizationData:{OrganizationData:{OrganizationName:DataFromBackend.OrganizationName , OrganizationID: DataFromBackend.OrganizationID} , OrganizationJoiningCode: DataFromBackend.OrganizationJoiningCode , RunDate:DataFromBackend.RunDate , CurrentDaySales:DataFromBackend.OrgState.CurrentDaySales , ClosingTime:DataFromBackend.ClosingTime ,Weekends:DataFromBackend.OrgState.Weekends , TotalExpense:DataFromBackend.PNL.TotalExpense , TotalRevenue:DataFromBackend.PNL.TotalRevenue}});

            //Set message to error object
            ObjError.message = "Organization created successfully"
            
        } catch (error) {
            ObjError = {success:false , message:'Failed while creating a organization'}
        }
        finally{
            set({IsNewOrgLoading:false});
            return ObjError
        }
    },
    FillOrgData:async () => {
        try {
            const res = await AxiosInstance.get('/api/userservice/org/fill-organization-data');

            const DataFromBackend = res.data.data;

            //Set Global State
            set({OrganizationData:[[DataFromBackend]]})

            return {success:true}
        } catch (error) {
            console.log(error)
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
    },
    CloseDay:async() => {
        set({IsClosingDay:true});
        try {
            
        } catch (error) {
            return {success:false , message:"Error while closing the day(Client)...!"}
        }
        finally{
            set({IsClosingDay:true});
        }
    }
}))

const Validate =  (ValidationType , Data) => {
    try {
        if(ValidationType === "CreateOrg"){
            const {OrganizationName , TypeOfBusiness , Address , ClosingTime , Weekends} = Data;
            if([OrganizationName , TypeOfBusiness , Address.Street , Address.City , Address.Country , Address.Pincode , ClosingTime , Weekends].some(Value => Value === undefined)){
                return {success:false , message:"Please fill all fields ...!"}
            }

            //ClosingTime Conversion to SQL time dataType
            Data.ClosingTime = Data.ClosingTime.format("HH:mm:ss");

            if(Weekends.length !== 2){
                return {success:false , message:"Please select two days as weekend...!"}
            }
            
            return {success:true , message:"Validation Done ...!"}
        }
        else if(ValidationType == "JoinOrg"){
            if(Data?.JoinMethod == "referral"){
                const {OrganizationJoiningCode} = Data ; 
                if(OrganizationJoiningCode.toString().length !== 8){
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
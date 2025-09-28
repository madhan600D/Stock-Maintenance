import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
const useUser = create((set , get) => ({
    IsAuthenticated:false,
    
    //Fallback States
    IsSignUpLoading:false,
    IsLoginLoading:false,
    IsAddUserLoading:false,
    IsUserValidationLoading:false,
    IsPageLoading:false,
    SuspenseTexts:[],
    UserData:{},
    OrganizationData:{},
    CurrentOrg:null,
    IsAdmin:false,
    IsError:null,


    SignUp: async (UserCredentials) => {
        let ObjError = {success:true , message:''}
        let DataFromBackend
        try {
            //API Structure:{userName , userMail , password}
            set({IsSignUpLoading:true});
            const Validation = await Validate('SignUp' , UserCredentials)
            if(!Validation.success){
                ObjError = {success:false , message:Validation.message}
                return ObjError 
            }
            const res = await AxiosInstance.put('/api/userservice/signup' , UserCredentials)
            DataFromBackend = res.data;

            if(DataFromBackend.success){
                ObjError = {success:true , message:DataFromBackend.message}
            }

            } catch (error) {
                ObjError = {success:false , message:"Error signing up...!"}
            }
            finally{
                set({IsSignUpLoading:false});
                return ObjError;
            }
    },
    AddUser: async (UserCredentials) => {
        set({IsAddUserLoading:true})
        let DataFromBackend , ObjError = {success:true , message:''};
        try {
            //API Structure:{userName , userMail , password}
            const Validation = await Validate('SignUp' , UserCredentials);
            if(!Validation){
                ObjError = {success:false , message:Validation.message}
                return ObjError
            }

            const res = await AxiosInstance.put('/api/userservice/add-user' , UserCredentials)
            DataFromBackend = res.data;

            //Set UserData
            set({
                IsAuthenticated: true,
                UserData: {
                    UserName: DataFromBackend.data.UserName,
                    UserMail: DataFromBackend.data.UserMail,
                    UserID: DataFromBackend.data.UserID
                },
                OrganizationData: {
                    OrganizationID: 1,
                    OrganizationName: "New"
                }
            });
            set({IsAuthenticated:true})
            ObjError = {success:true , message:"Sign up successfull"}

        } catch (error) {
            console.log(error)
            ObjError = {success:false , message:"Signup failed...! at Error block"}
        }
        finally{
            set({IsAddUserLoading:false})
            return ObjError
        }
    },
    ValidateUser:async () => {
        set({IsPageLoading:true , 
            IsInitialLoad:false
        })
        try {
            const res = await AxiosInstance.get('api/userservice/validate-user');
            const DataFromBackend = res.data;
            if(DataFromBackend.data){
                console.log(DataFromBackend.data)

                set({
                IsAuthenticated: true,
                UserData: {
                    UserName: DataFromBackend.data.UserName,
                    UserMail: DataFromBackend.data.UserMail,
                    UserID: DataFromBackend.data.UserID
                },
                OrganizationData: {
                    OrganizationID: DataFromBackend.data.OrganizationID,
                    OrganizationName: DataFromBackend.data.OrganizationName
                }
            });
                return {success:true , message:DataFromBackend.message}
            }
            else{
                set({IsAuthenticated:true});
                set({UserData:{}});
                set({OrganizationData:{}})
                return {success:false , message:DataFromBackend.message}
            }
        } catch (error) {
            set({IsAuthenticated:false})
            return{success:false , message:error.response ? error.response.data.message : error.message};
        }
        finally{
            set({IsPageLoading:false})
        }
    },
    Login:async (UserCredentials) => {
        set({IsLoginLoading:true})
        try {
            const Validation = await Validate('LogIn' , UserCredentials);
            if(!Validation.success){
                return {success:false , message:Validation.message}
            }
            const res = await AxiosInstance.post('/api/userservice/login' , UserCredentials);
            const DataFromBackend = res.data;
            set({
                IsAuthenticated: true,
                UserData: {
                    UserName: DataFromBackend.data.UserName,
                    UserMail: DataFromBackend.data.UserMail,
                    UserID: DataFromBackend.data.UserID
                },
                OrganizationData: {
                    OrganizationID: DataFromBackend.data.OrganizationID,
                    OrganizationName: DataFromBackend.data.OrganizationName
                }
            });
            return {success:true , message:DataFromBackend.message , data:DataFromBackend};
        } catch (error) {
            console.log(error)
            return{success:false , message:error.response ? error.response.data.message : error.message};
        }
        finally{
            set({IsLoginLoading:false})
        }
    },
    Logout: async () => {
        try {
            const res = await AxiosInstance.get('/api/userservice/logout');
            await get().ValidateUser();
            return {success:true , message:"Logged out successfully...!"}
        } catch (error) {
            return {success:true , message:"Logged out failed...!"}
        }
    },
    GetLoadingTexts: async () => {
        set({IsPageLoading:true});
        try {
            //Store in Local Storage
            const LoadingTexts = localStorage.getItem("LoadingTexts")
            if(LoadingTexts){
                set({SuspenseTexts:JSON.parse(LoadingTexts).map(TextData => TextData.Text)})
                return 
            }
            const res = await AxiosInstance.get('/api/userservice/get-loadingtexts')
            const DataFromBackend = res.data.data;
            
            //Load in Local Storage
            localStorage.setItem("LoadingTexts" , JSON.stringify(DataFromBackend))

            set({SuspenseTexts:DataFromBackend.map(TextData => TextData.Text)})
            return {success:true , message:"Suspense Texts Loaded...!"}
        } catch (error) {
            return {success:false , message:error.message}
        }
        finally{
            set({IsPageLoading:false});
        }
    }
}))

const Validate = async (ValidationType , Data) => {
    if(ValidationType === "SignUp"){
        const {userName , userMail , password} = Data;
        if(! userName || !userMail || !password){
            return {success:false , message:"Please fill all the fields ...!"}
        }
        return {success:true , message:"Validation successfull ...!"}
    }
    if(ValidationType === "LogIn"){
        const {userName , password} = Data;
        if(!userName || !password){
            return {success:false , message:"Please fill all the fields ...!"}
        }
        return {success:true , message:"Validation successfull ...!"}
    }
}
export default useUser
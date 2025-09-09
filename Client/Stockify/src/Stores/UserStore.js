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
        try {
            //API Structure:{userName , userMail , password}
            set({IsSignUpLoading:true});
            const Validation = await Validate('SignUp' , UserCredentials)
            if(!Validation.success){
                return {success:false , message:Validation.message}
        }
        const res = await AxiosInstance.put('/api/userservice/signup' , UserCredentials)
        const DataFromBackend = res.data;
        if(DataFromBackend.success){
            return {success:true , message:DataFromBackend.message}
        }
        } catch (error) {
            console.log(error)
            return {success:false , message:error.response.data.message}
        }
        finally{
            set({IsSignUpLoading:false});
        }
    },
    AddUser: async (UserCredentials) => {
        set({IsAddUserLoading:true})
        try {
            //API Structure:{userName , userMail , password}
            const Validation = await Validate('SignUp' , UserCredentials);
            if(!Validation){
                return {success:false , message:Validation.message}
            }
            const res = await AxiosInstance.put('/api/userservice/add-user' , UserCredentials)
            const DataFromBackend = res.data;
            //Set UserData
            set({UserData:{UserName:UserCredentials.userName , UserMail:UserCredentials.userMail , Password:UserCredentials.password}})
            set({IsAuthenticated:true})
            return {success:true , message:DataFromBackend.message};

        } catch (error) {
            console.log(error)
            return{success:false , message:error.response.data ?error.response.data.message : error.message };
        }
        finally{
            set({IsAddUserLoading:false})
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
                set({UserData:DataFromBackend.data});
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
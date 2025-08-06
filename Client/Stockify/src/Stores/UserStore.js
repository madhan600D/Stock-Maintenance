import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
import ShowToast from '../Pages/Components/Toast/Toast.js';
const useUser = create((set , get) => ({
    IsAuthenticated:false,
    
    //Fallback States
    IsSignUpLoading:false,
    IsLoginLoading:false,
    IsAddUserLoading:false,

    UserData:null,
    SignUp: async (UserCredentials) => {
        try {
            //API Structure:{userName , userMail , password}
            set({IsSignUpLoading:true});
            const Validation = await Validate('SignUp' , UserCredentials)
            if(!Validation.success){
                return {success:false , message:Validation.message}
        }
        const res = await AxiosInstance.put('/api/userservice/signup' , UserCredentials)
        const DataFromBackend = res.data.data;
        } catch (error) {
            console.log(error.message)
            return {success:false , message:error.message}
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
            const res = await AxiosInstance.put('add-user' , UserCredentials)
            const DataFromBackend = res.data.data;
            //Set UserData
            set({UserData:{UserName:UserCredentials.UserName , UserMail:UserCredentials.UserMail , Password:UserCredentials.Password}})
            return {success:true , message:DataFromBackend.message};

        } catch (error) {
            return{success:false , message:error.message};
        }
        finally{
            set({IsAddUserLoading:false})
        }
    },
    Login:async (UserCredentials) => {
        set({IsLoginLoading:true})
        try {
            const Validation = await Validate('LogIn' , UserCredentials);
            if(!Validation.success){
                return {success:false , message:Validation.message}
            }
            const res = await AxiosInstance.get('/login' , UserCredentials);
            set({UserData:{UserName:UserCredentials.UserName , UserMail:UserCredentials.UserMail , Password:UserCredentials.Password}})
            return {success:true , message:DataFromBackend.message};
        } catch (error) {
            return{success:false , message:error.message};
        }
        finally{
            set({IsLoginLoading:false})
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
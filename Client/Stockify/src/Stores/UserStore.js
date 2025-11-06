import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
import {connect, io} from 'socket.io-client'
//Declarations
const ServerURL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/' : '/' ;
import { ClientSocketEventsEnum } from '../Declarations/ClientPublicEnums.js';
//Methods

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
    SocketState:null,
    CurrentOrg:null,
    LastSocketMessage:'',
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
                
            }
            else{
                set({IsAuthenticated:false});
                set({UserData:{}});
                set({OrganizationData:{}})
                return {success:false , message:DataFromBackend.message}
            }

            //Socket state reinit
            if (!get().SocketState?.connected){
                await get().ConnectSocket();
            }  
            return {success:true , message:DataFromBackend.message}
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
            
            //WebSocket connection:
            await get().ConnectSocket()
            return {success:true , message:DataFromBackend.message , data:DataFromBackend};
        } catch (error) {
            console.log(error)
            return{success:false , message:error.response ? error.response.data.message : error.message};
        }
        finally{
            set({IsLoginLoading:false})
        }
    },
    ConnectSocket:async() => {
        try {
            const {UserData , OrganizationData} = get();

            if(!UserData || !OrganizationData) return;

            const ClientSocketServer = new io(ServerURL , {
                query:{
                    UserID:UserData.UserID,
                    OrganizationID:OrganizationData.OrganizationID
                }
            })

            ClientSocketServer.connect();

            //Update Zustand socket states
            set({SocketState:ClientSocketServer});

            //Initialize listeners
            await get().InitializeSocketEvents(ClientSocketServer);
        } catch (error) {
            console.log(error)
            return {success:false , message:"Socket connection failed",error}
        }
    },
    InitializeSocketEvents:async(Socket) => {
        try {
            //Neutralize the listener before initiating
            // Socket.off(ClientSocketEventsEnum.ROOM_CONFIRMATION)

            //Initialize all socket events
            Socket.on(ClientSocketEventsEnum.ROOM_CONFIRMATION , (Payload) => {get().RoomConfirmationHandler(Payload)});
        } catch (error) {
            console.log("error while init SocketEvents" , error)
        }
    }
    ,
    RoomConfirmationHandler:(Payload) => {
        try {
            //Payload.Message:{"User is online now!"}
            set({LastSocketMessage:Payload.Message});

        } catch (error) {
            console.log(error)
        }
    },
    DisconnectSockets:async() => {
        try {
            const ExistingSocket = get().SocketState;
            if(ExistingSocket){
                ExistingSocket.disconnect()
                set({SocketState:null})
            }
            return

        } catch (error) {
            console.log(error)
        }
    },
    UpdateSocketMessageState:async(Payload) => {
        try {
            set({LastSocketMessage:Payload.Message});
        } catch (error) {
            console.log(error)
        }
    },
    Logout: async () => {
        try {
            const res = await AxiosInstance.get('/api/userservice/logout');
            await get().ValidateUser();
            await get().DisconnectSockets();
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
        const {userName , userMail} = Data;
        if(! userName || !userMail){
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
//Servers
import {Server} from 'socket.io'

//Public consts
import { EventActionsEnum, SocketEventsEnum } from '../Declarations/PublicEnums.js';

//Objects
import objInventoryDataBase from '../Utils/InventoryDB.js'
class SocketServer{
    constructor(){
        this.SocketServer = null;
        this.HttpServer;
        this.SocketIDMap = new Map();
    }
    async InitSocketServer(HttpServer){
        try {
            //Socket server 
            this.SocketServer = new Server(HttpServer , {
                cors:["http://localhost:5173"]
            })
            await this.InitEventListeners()
        } catch (error) {
            console.log(error)
        }
    }   
    async InitEventListeners(){
        try {
            //Connection Listener: This event is called after login
            //1. Validate User and Org ID and join them in rooms based on OrgID
            this.SocketServer.on(SocketEventsEnum.connection , async (Socket) => await this.HandleNewConnection(Socket));
        } catch (error) {
            console.log(error)
        }
    }
    async HandleNewConnection(Socket){
        try {
            const {UserID , OrganizationID} = Socket.handshake.query;
            let RoomConfirmPayload = {}
            const UserInfo = await objInventoryDataBase.AllModels.users.findOne({where:{userId:UserID} , raw:true});

            //Non Org Member : return 
            if(OrganizationID == 1) return ;

            //Join room
            const RoomID = this.GetRoomID(OrganizationID)
            Socket.join(RoomID);

            //Map Socket ID to UserID
            this.SocketIDMap.set(UserID , Socket.id);

            RoomConfirmPayload.Message = `${UserInfo.userName} is online now!`
            Socket.to(RoomID).emit(SocketEventsEnum.ROOM_CONFIRMATION , RoomConfirmPayload)
            console.log("Connection Event: Established")
        } catch (error) {
            console.log(error)
        }
    }
    async HandleProductEvent(Payload){
        //Broadcast inventory Product updates to all room members.
        try {
            switch (Payload.EventType){
                case EventActionsEnum.ADD:
                    this.SocketServer.to(this.GetRoomID(Payload.UserData.OrganizationID)).emit(SocketEventsEnum.PRODUCT_EVENT , Payload);
                case EventActionsEnum.ALTER:
                    this.SocketServer.to(this.GetRoomID(Payload.UserData.OrganizationID)).emit(SocketEventsEnum.PRODUCT_EVENT , Payload)
            }
        } catch (error) {
            console.log(error)
        }
    }
    GetRoomID(OrganizationID){
        return `Org#${OrganizationID}`
    }
}

export const MainServer = new SocketServer()
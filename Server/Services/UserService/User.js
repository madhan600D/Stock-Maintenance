import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import signUpRouter from './Router/signup.routes.js'; 
import objUserDb from './Utils/userDB.js'
import objInventoryDataBase from './Utils/InventoryDB.js'
import organizationRouter from './Router/organization.routes.js';
import {ObjUserServiceStartup} from './Class/Startup.class.js'
import InventoryRouter from './Router/Inventory.routes.js'; 

//Sevrer
import {MainServer} from './Class/Socket.class.js'
import http from 'http'
import {Server} from 'socket.io'
import express from 'express'

dotenv.config();
const port = process.env.userPort;


const App = express()


//Setup Middlewares
App.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

//Router Setup
App.use(express.json({ limit: '20mb' }));
App.use(cookieParser())
App.use('/api/userservice', signUpRouter);
App.use('/api/userservice/org' , organizationRouter)
App.use('/api/userservice/inv' , InventoryRouter)

//Create Htpp Sevrer
const HttpServer = http.createServer(App)

//Instantiate socket server.
await MainServer.InitSocketServer(HttpServer)
try {
  HttpServer.listen(port, () => {
    objUserDb.connectDB();
    objInventoryDataBase.connectDB();
    ObjUserServiceStartup.Startup()
    console.log(`Main server is running on port: ${port}`);
  }); 
} catch (error) {
  console.error("Error initiating server:", error);
}

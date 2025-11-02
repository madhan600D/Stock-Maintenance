import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import signUpRouter from './Router/signup.routes.js'; 
import objUserDb from './Utils/userDB.js'
import objInventoryDataBase from './Utils/InventoryDB.js'
import organizationRouter from './Router/organization.routes.js';
import {ObjUserServiceStartup} from './Class/Startup.class.js'
import InventoryRouter from './Router/Inventory.routes.js'; 
dotenv.config();

const userServer = express();
const port = process.env.userPort;
//Setup Middlewares
userServer.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
userServer.use(express.json({ limit: '20mb' }));
userServer.use(cookieParser())
userServer.use('/api/userservice', signUpRouter);
userServer.use('/api/userservice/org' , organizationRouter)
userServer.use('/api/userservice/inv' , InventoryRouter)



try {
  
  userServer.listen(port, () => {
    objUserDb.connectDB();
    objInventoryDataBase.connectDB();
    ObjUserServiceStartup.Startup()
    console.log(`Main server is running on port: ${port}`);
  }); 
} catch (error) {
  console.error("Error initiating server:", error);
}

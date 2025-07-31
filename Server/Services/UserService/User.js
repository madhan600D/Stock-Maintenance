import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import signUpRouter from './Router/signup.router.js'; 
import objUserDb from './Utils/userDB.js'
import organizationRouter from './Router/organization.router.js';
dotenv.config();

const userServer = express();
const port = process.env.userPort;
//Setup Middlewares
userServer.use(express.json({ limit: '20mb' }));
userServer.use(cookieParser())
userServer.use('/api/userservice', signUpRouter);
userServer.use('/api/userservice/org' , organizationRouter)



try {
  
  userServer.listen(port, () => {
    objUserDb.connectDB();
    console.log(`User server is running on port: ${port}`);
  }); 
} catch (error) {
  console.error("Error initiating server:", error);
}

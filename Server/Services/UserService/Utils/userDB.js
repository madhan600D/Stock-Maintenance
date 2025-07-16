import { Sequelize, DataTypes } from "sequelize";
import userRoleModel from "../Models/userRoleModel.js";
import organizationModel from "../Models/organizationModel.js";
import sessionModel from "../Models/sessionModel.js";
import userModel from "../Models/userModel.js";
import adminModel from "../Models/adminModel.js";
import otpModel from "../Models/otpModel.js";
import taskBucketModel from "../Models/taskBucketModel.js";
import userErrorLogModel from "../Models/userErrorLogModel.js";
class UserDatabase {
  constructor() {
    // Database config
    this.userDB = new Sequelize('USER', 'UserServer', 'Password@12345', {
      host: 'localhost',
      dialect: 'mssql',
      dialectOptions: {
        options: { 
          encrypt: false,
          trustServerCertificate: true
        }}});
    //Initialize database 
    this.users = userModel(this.userDB , DataTypes)
    this.userRoles = userRoleModel(this.userDB , DataTypes) 
    this.organizations = organizationModel(this.userDB , DataTypes)
    this.sessions = sessionModel(this.userDB , DataTypes)
    this.admins = adminModel(this.userDB , DataTypes)
    this.otps = otpModel(this.userDB , DataTypes) 
    //this.tasksBucket = taskBucketModel(this.userDB , DataTypes)
    this.userErrorLog = userErrorLogModel(this.userDB , DataTypes) 
    this.allModels = {users:this.users ,userRoles:this.userRoles , organizations:this.organizations ,
      sessions:this.sessions ,admins:this.admins , otps:this.otps}   //Make primary and foreign key constraints   
    Object.values(this.allModels).forEach((parmModel) => {
        if(parmModel.associate){ 
            parmModel.associate(this.allModels) 
        }
    })  
  }
  // Connect method
  connectDB = async () => { 
    try {
      await this.userDB.authenticate(); 
      await this.userDB.sync();
      console.log("UserDB connected and Tables synced ...!");
    } catch (error) {
      console.error("DB Connection failed:", error);
    }
  };
} 
const objUserDb = new UserDatabase(); 

export default objUserDb;

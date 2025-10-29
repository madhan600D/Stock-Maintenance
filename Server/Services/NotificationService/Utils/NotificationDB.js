import { Sequelize, DataTypes } from "sequelize";
//Models
import ConfigurationSettingModel from "../Models/ConfigurationSettingModel.js";
import NotificationBucketModel from "../Models/NotificationBucketModel.js";
import NotificationCoolDownModel from "../Models/NotificationCoolDownModel.js";
import NotificationDeliveryModel from "../Models/NotificationDeliveryStatusModel.js";
import NotificationModel from "../Models/NotificationModel.js"; 
import UserModel from "../Models/UserModel.js";
import ConsumedEventsModel from "../Models/ConsumedEventsModel.js";
import ProducedEventsModel from '../Models/ProducedEventsModel.js'

class NotificationDatabase {
  constructor() {
    // Database config
    this.NotificationDB = new Sequelize('NOTIFICATION', 'NotificationServer', 'Password@12345', {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
          options: { 
            encrypt: false,
            trustServerCertificate: true
        }}});
    //Initialize database 
    this.ConfigurationSettings = ConfigurationSettingModel(this.NotificationDB , DataTypes)
    this.NotificationBuckets = NotificationBucketModel(this.NotificationDB , DataTypes)
    this.NotificationCoolDown = NotificationCoolDownModel(this.NotificationDB , DataTypes)
    this.NotificationDeliveryStatus = NotificationDeliveryModel(this.NotificationDB , DataTypes)
    this.Notifications = NotificationModel(this.NotificationDB , DataTypes)
    this.Users = UserModel(this.NotificationDB , DataTypes)
    this.ProducedEvents = ProducedEventsModel(this.NotificationDB , DataTypes)
    this.ConsumedEvents = ConsumedEventsModel(this.NotificationDB , DataTypes)
    this.allModels = {ConfigurationSettings:this.ConfigurationSettings ,NotificationBuckets:this.NotificationBuckets , 
        NotificationCoolDown:this.NotificationCoolDown ,NotificationDeliveryStatus:this.NotificationDeliveryStatus ,
        Notifications:this.Notifications , Users:this.Users , ConsumedEvents:this.ConsumedEvents , ProducedEvents:this.ProducedEvents}
        
    Object.values(this.allModels).forEach((parmModel) => {
        if(parmModel.associate){ 
            parmModel.associate(this.allModels) 
        }
    })  
  }
  // Connect method
  connectDB = async () => { 
    try {
      await this.NotificationDB.authenticate(); 
      await this.NotificationDB.sync();
      console.log("Notification DB connected and Tables synced ...!");
    } catch (error) {
      console.error("DB Connection failed:", error);
    }
  };
} 
export const objNotificationDB = new NotificationDatabase(); 


import { Sequelize, DataTypes } from "sequelize";
//Models

class InventoryDataBase {
  constructor() {
    // Database config
    this.InventoryDB = new Sequelize('USER', 'USERSERVER', 'Password@12345', {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
          options: { 
            encrypt: false,
            trustServerCertificate: true
        }}});
    //Initialize database 
    this.ConfigurationSettings = ConfigurationSettingModel(this.NotificationDB , DataTypes)
    this.allModels = {ConfigurationSettings:this.ConfigurationSettings}
        
    Object.values(this.allModels).forEach((parmModel) => {
        if(parmModel.associate){ 
            parmModel.associate(this.allModels) 
        }
    })  
  }
  
  // Connect method
  connectDB = async () => { 
    try {
      await this.InventoryDB.authenticate(); 
      await this.InventoryDB.sync();
      console.log("Inventory DB connected and Tables synced ...!");
    } catch (error) {
      console.error("Inventory DB Connection failed:", error);
    }
  };
} 
export const ObjInventoryDB = new InventoryDataBase(); 


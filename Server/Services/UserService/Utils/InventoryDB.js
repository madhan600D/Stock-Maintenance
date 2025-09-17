import { Sequelize, DataTypes } from "sequelize";

//Models
import CategoryModel from "../Models/InventoryModels/Category.Model.js";
import ProductModel from "../Models/InventoryModels/Product.Model.js";
import VendorModel from "../Models/InventoryModels/Vendor.Model.js";

//All Models
import AllModels from "./AllModels.js";
class InventoryDataBase {
  constructor() {
    try {
      this.InventoryDB = new Sequelize('USER', 'UserServer', 'Password@12345', {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
          options: { 
            encrypt: false,
            trustServerCertificate: true
        }}});
    //Initialize database 
    this.Category = CategoryModel(this.InventoryDB , DataTypes)
    this.ProductModel = ProductModel(this.InventoryDB , DataTypes) 
    this.VendorModel = VendorModel(this.InventoryDB , DataTypes)

    //All Models
    this.allModels = AllModels
    
    //Make primary and foreign key constraints   
    Object.values(this.allModels).forEach((parmModel) => {
        if(parmModel.associate){ 
            parmModel.associate(this.allModels)  
        }
    })
    } catch (error) {
        console.log(error.message)  
    }
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
const objInventoryDataBase = new InventoryDataBase(); 

export default objInventoryDataBase; 

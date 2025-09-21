import { InitializeDataBase } from "./AllModels.js";

class InventoryDatabase {
  constructor() {
    this.allModels = null;
    this.InventoryDB = null;
  }

  async Init() {
    const { Models, InventoryDB } = await InitializeDataBase();
    this.AllModels = Models;
    this.InventoryDB = InventoryDB;

    // Apply associations if any
    Object.values(this.AllModels).forEach((model) => { 
      if (model.associate) {
        model.associate(this.AllModels);   
      } 
    });
  }

  connectDB = async () => {
    try {
      await this.InventoryDB.authenticate();
      await this.InventoryDB.sync();
      console.log("Inventory DB connected and Tables synced ...!");
    } catch (error) {
      console.error("DB Connection failed:", error);
    }
  };
}

const objInventoryDataBase = new InventoryDatabase();
await objInventoryDataBase.Init();  // ensure models are loaded

export default objInventoryDataBase;

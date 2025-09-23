import { InitializeDataBase } from "./AllModels.js";

class UserDatabase {
  constructor() {
    this.AllModels = null;
    this.userDB = null;
  }

  async Init() {
    const { Models, userDB } = await InitializeDataBase();
    this.AllModels = Models;
    this.userDB = userDB;

    // Apply associations if any
    Object.values(this.AllModels).forEach((model) => {
      if (model.associate) {
        model.associate(this.AllModels); 
      }
    });
  }

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
await objUserDb.Init();  // ensure models are loaded

export default objUserDb;

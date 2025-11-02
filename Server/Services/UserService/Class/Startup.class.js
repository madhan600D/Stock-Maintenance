import objInventoryDataBase from "../Utils/InventoryDB.js";
import ObjAutoCloseDay from "./AutoCloseDay.class.js";

class UserServiceStartup{
    constructor(Database){
        this.Database = Database;
    }
    async Startup(){
        try {
            console.log("Startup initiated ...!")
            await this.StartAutoDayShifter()
        } catch (error) {
            
        }
    }
    async StartAutoDayShifter(){
        try {
            await ObjAutoCloseDay.Init()
            
        } catch (error) {
            
        }
    }
}

export const ObjUserServiceStartup = new UserServiceStartup(objInventoryDataBase);
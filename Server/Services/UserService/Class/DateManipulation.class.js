import { DATE } from "sequelize";
import { DaysEnum } from "../Declarations/PublicEnums.js";
import objInventoryDataBase from "../Utils/InventoryDB.js";
class DateManipulation{
    constructor(){
        this.DataBase = objInventoryDataBase
    }
    async GetNextBusinessDay(CurrentDay , UserData){
    try {
        //Declarations
        let IsHoliday = true;
        const {OrganizationID} = UserData;

        //While Loop untill non holiday or non weekend day is found.
        const OrgStateDB = await this.DataBase.AllModels.OrgState.findOne({where:{OrganizationID:OrganizationID}});
        
        const OrganizationWeekendIndexArray =  OrgStateDB.Weekends.split(",").map(D => DaysEnum[D])
        //1.Parse weekend and get index from enum and skip the day if it is holiday
        let CurrentDayObj = new Date(CurrentDay)
        while(IsHoliday){
            CurrentDayObj = this.GetNextDay(CurrentDayObj)

            //Get the day index for the day
            const DayIndex = CurrentDayObj.getDay();

            //IsWeekend
            IsHoliday = OrganizationWeekendIndexArray.includes(DayIndex) ? true  : false;
        }
        return {success:true , data:CurrentDayObj.toISOString().split("T")[0]};
    } catch (error) {
        console.log("Error in GetNextBusinessDay" , error)
        return {success:false , message:error}
    }
    }
    GetNextDay(currentDate) {
        try {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + 1);
            return date;
        } catch (error) {
            console.error("Error in GetNextDay:", error);
            throw error;
        }
    }
}

export const ObjDateManipulations = new DateManipulation()
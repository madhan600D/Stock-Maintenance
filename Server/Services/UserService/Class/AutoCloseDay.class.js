import objInventoryDataBase from "../Utils/InventoryDB.js";
import { ObjDateManipulations } from "./DateManipulation.class.js";

//Modules
import Simulation from '../Class/Simulation.class.js'
import { Op } from "sequelize";
import { ObjOrder } from "./Order.class.js";

class AutoCloseDay{
    constructor(Database){
        this.Database = Database;
        this.OrganizationCloseTimings = new Map()
        this.ErrorObj = {success:true , message:''}
    }
    async Init(){
        try {
            //1.Fill Organization Timing map
            const AllOrgStates = await this.Database.AllModels.OrgState.findAll({raw:true});
            for(let OrgState of AllOrgStates){
                this.OrganizationCloseTimings.set(OrgState.OrganizationID , {ClosingTime:OrgState.ClosingTime , IsDayClosed:OrgState.IsDayClosed});
            }
            console.log("Test Map:" , this.OrganizationCloseTimings)
            //2.Initialize auto day checker
            setInterval(() => {
                console.log(`Auto Day closer initialized...!`)
                this.AutoCloseDay();
            } , 600000);
        } catch (error) {
            this.ErrorObj = {success:false , message:error}
            console.log(this.ErrorObj)
            return this.ErrorObj
        }
        

    }

    async AutoCloseDay(){
        try {
            
            for(let OrganizationID of this.OrganizationCloseTimings.keys()){
                if(this.IsToCloseDay(OrganizationID)){
                    //Product simulation and auto order placement
                    const ProductsOfOrganization = await objInventoryDataBase.AllModels.Products.findAll({where:{OrganizationID:OrganizationID} , raw:true});
                    let ProductEWMA  = [] , OrderArray = []

                    for(let Product of ProductsOfOrganization){
                        var ObjSimulation = new Simulation(Product , objInventoryDataBase);

                        const LTDforProduct = await ObjSimulation.ForecastDemand()

                        if(LTDforProduct >= Product.Quantity){
                            //Add to order array
                            OrderArray.push({ProductID:Product.ProductID , ProductName:Product.ProductName , Quantity:LTDforProduct})

                            //ProductEWMA result for DB updation
                            ProductEWMA.push({ProductID:Product.ProductID , SimulatedLTD:LTDforProduct})
                        }
                    }

                    
                    //Prepare parameters for order
                    const OrganizationData = await objInventoryDataBase.AllModels.organizations.findOne({where:{organizationId:OrganizationID} , raw:true});

                    const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:OrganizationID}});

                    //Update EWMA results in DB
                    await ObjSimulation.UpdateEWMAResult(ProductEWMA , {OrganizationID:OrganizationData.organizationId , RunDate:OrgState.RunDate});

                    let UserDataParam = {OrganizationID:OrganizationID , OrganizationName:OrganizationData.OrganizationName , RunDate:OrgState.RunDate};

                    //Place order
                    await ObjOrder.PlaceManualOrder(UserDataParam , OrderArray);
                    console.log(`Auto Order Placed for ${OrganizationData.OrganizationName}. Order Details: ${OrderArray}`);


                    //Process Close Day
                    console.log(`Closing the day for: ${OrganizationID}`)
                    await this.UpdateOrgState(OrganizationID);
                    
                    
                    //TBD: Call socket class and intimate that the day is closed
                }
            }
        } 
        catch (error) {
            this.ErrorObj = {success:false , message:error}
            console.log(this.ErrorObj)
            return this.ErrorObj
        }
    }
    IsToCloseDay(OrganizationID){
        try {
            let IsCloseDay , IsPastCloseTime , OrgClosingTime;
            
            const Now = new Date();
            const CurrentTime = Now.getHours();

            //1.Calculate is past close timing
            [OrgClosingTime] = this.OrganizationCloseTimings.get(OrganizationID)?.ClosingTime.split(':')
            if(CurrentTime >= parseInt(OrgClosingTime)){
                IsPastCloseTime = true;
            }
            else{
                IsPastCloseTime = false;
            }

            //2.Validate IsDayClosedFlag & Timing
            IsCloseDay = this.OrganizationCloseTimings.get(OrganizationID)?.IsDayClosed === 0 && IsPastCloseTime ? true : false;
                
            return IsCloseDay;
        } catch (error) {
            this.ErrorObj = {success:false , message:error}
            console.log(this.ErrorObj)
            return this.ErrorObj
        }
    }
    async UpdateOrgState(OrganizationID){
        try {
            //0.Declarations
            var Transaction = await this.Database.InventoryDB.transaction()
            //1.Get next rundate
            const CurrentOrgState = await this.Database.AllModels.OrgState.findOne({where:{OrganizationID:OrganizationID} , raw:true});

            const NextRundate = await ObjDateManipulations.GetNextBusinessDay(CurrentOrgState.RunDate);
            //2.Update OrgState
            const [Count, NewOrganizationState] = await this.Database.AllModels.OrgState.update(
                                    { RunDate: NextRundate.data, CurrentDaySales: 0  , IsDayClosed:1},
                                    {
                                        where: { OrganizationID: OrganizationID },
                                        transaction: Transaction,
                                        returning: true,
                                        raw:true
                                    }
                                    );
            //3.Update internal state
            this.OrganizationCloseTimings.set(OrganizationID , {ClosingTime:NewOrganizationState[0].ClosingTime , IsDayClosed:1});
            await Transaction.commit();
        } catch (error) {
            this.ErrorObj = {success:false , message:error}
            await Transaction.rollback()
            console.log(this.ErrorObj)
            return this.ErrorObj
        }
    }
}

const ObjAutoCloseDay = new AutoCloseDay(objInventoryDataBase);

export default ObjAutoCloseDay;
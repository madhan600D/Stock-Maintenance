import {Op} from 'sequelize'
class Simulation{
    constructor(ProductData , DataBase){
        this.ProductData = ProductData;
        this.DataBase = DataBase;
        this.DataPoints = [];
        this.LeadTime = null;
        this.ArrayOfEWMA = [];
        this.Bias = 0.6 //Balanced Support for old and new values
    }

    async ForecastDemand(){
        try {
            //Fill Datapoints
            await this.FillSimulationArray(this.ProductData);

            //Forecast demand for the product
            const ForecastValue = this.ComputeEWMA(this.DataPoints.length - 1);

            //Compute LTD
            const LTD = this.ComputeLTD(ForecastValue)

            return LTD;
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }
    async FillSimulationArray(ProductData){
        try {
            //Fill internal array from DB
            const SalesRecordArray = await this.DataBase.AllModels.DailyProductSales.findAll({where:            {ProductID:ProductData.ProductID} , 
                attributes:['SaleQuantity'] , 
                order:[['RunDate' , 'ASC']],
                limit:100,
                raw:true});

            this.DataPoints = [...SalesRecordArray]

            this.LeadTime = await this.DataBase.AllModels.findOne({where:{
                [Op.and] : [{OrganizationID:this.ProductData.OrganizationID , VendorID:this.ProductData.VendorID}]
            }})

            return {success:true}
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }

    ComputeEWMA(Index){
        try {
            //Base case
            if(Index === 0){
                return this.DataPoints[0]
            }
            //Current Value
            return this.Bias * this.DataPoints[Index] + 
            //Previous Value
            (1 - this.Bias) * this.ComputeEWMA(Index - 1);
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }

    ComputeLTD(EWMAValue){
        try {
            return this.LeadTime * EWMAValue;
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }
}
import {Op} from 'sequelize'
export default class Simulation{
    constructor(ProductData , DataBase){
        this.ProductData = ProductData;
        this.DataBase = DataBase;
        this.DataPoints = [];
        this.LeadTime = null;
        this.ArrayOfEWMA = [];
        this.Bias = 0.6 //Balanced Support for old and new values
    }

    async ForecastDemand(Transaction = null){
        try {
            //Fill Datapoints
            await this.FillSimulationArray(this.ProductData , Transaction);

            //Validations
            const IsSuccess = this.ValidateData()
            if(!IsSuccess.success){
                return IsSuccess
            }

            //Forecast demand for the product
            const ForecastValue = this.ComputeEWMA(this.DataPoints.length - 1);

            //Compute LTD
            const LTD = this.ComputeLTD(ForecastValue)

            return {success:true , data:LTD};
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }
    async FillSimulationArray(ProductData , Transaction = null){
        try { 
            //Fill internal array from DB
            const SalesRecordArray = await this.DataBase.AllModels.DailyProductSales.findAll({where:            {ProductID:ProductData.ProductID} , 
                attributes:['SaleQuantity'] , 
                order:[['RunDate' , 'ASC']],
                transaction:Transaction ? Transaction : '',
                limit:100,
                raw:true});

            this.DataPoints = [...SalesRecordArray]

            this.LeadTime = await this.DataBase.AllModels.LeadTimeTracker.findOne({where:{
                [Op.and] : [{OrganizationID:this.ProductData.OrganizationID , VendorID:this.ProductData.VendorID}]
            } , transaction:Transaction ? Transaction : ''})

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
                return this.DataPoints[0].SaleQuantity
            }
            //Current Value
            return Math.floor(this.Bias * this.DataPoints[Index].SaleQuantity + 
            //Previous Value
            (1 - this.Bias) * this.ComputeEWMA(Index - 1));
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }

    ComputeLTD(EWMAValue){
        try {
            return this.LeadTime.AverageLeadTime * EWMAValue;
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }

    ValidateData(){
        try {
            //Sanitize global values
            if(this.DataPoints.length == 0 ){
                return {success:false , message:"No sale record to simulate"}
            }

            if(!this.LeadTime){
                return {success:false , message:"No order data to simulate"}
            }

            return {success:true , message:"Proceed simulation"}

        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        }
    }
    async UpdateEWMAResult(EWMAArray , OrganizationData , Transaction){
        try {

            const NewEWMA  = await this.DataBase.AllModels.PredictedLTD.create({
                OrganizationID:OrganizationData.OrganizationID,
                PredictedEWMAJSON:EWMAArray,
                RunDate:OrganizationData.RunDate
            } , {transaction:Transaction})
        } catch (error) {
            console.log(error)
            return {success:false , message:error};
        } 
    }
}
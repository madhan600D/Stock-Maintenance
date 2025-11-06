export default (sequelize , DataTypes) => {
    const PredcitedLTDModel = sequelize.define('PredictedLTD', {
        LTDID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true 

        },
        //JSON of ProductID:Predicted EWMA 
        PredictedEWMAJSON:{ 
            type:DataTypes.STRING,
            allowNull:false,
            get(){
                const rawValue = this.getDataValue("PredictedEWMAJSON");
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                this.setDataValue("PredictedEWMAJSON", JSON.stringify(value));
            },
        },
        RunDate:{
            type:DataTypes.DATEONLY,
            allowNull:false
        }
    } , {
        tableName:'PredictedLTD',
        timeStamps:false
    })
    return PredcitedLTDModel;
}
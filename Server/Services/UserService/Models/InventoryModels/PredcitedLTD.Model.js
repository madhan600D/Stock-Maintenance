export default (sequelize , DataTypes) => {
    const PredcitedLTDModel = sequelize.define('PredictedLTD', {
        LTDID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true 

        },
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false, 
            references:{
                model:'organizations',
                key:'organizationId'
            }
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
        timestamps:false
    })
    PredcitedLTDModel.associate = (models) => {
        PredcitedLTDModel.belongsTo(models.organizations, {
            foreignKey:'OrganizationID',
            targetKey:'organizationId'
        });
    }
    return PredcitedLTDModel;
}
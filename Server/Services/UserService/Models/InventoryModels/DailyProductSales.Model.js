export default (sequelize , DataTypes) => {
    const DailyProductSalesModel = sequelize.define('DailyProductSales', {
        SaleID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        ProductID:{ 
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Products',
                key:'ProductID'
            }
        },
        RunDate:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        SaleQuantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    } , {
        tableName:'DailyProductSales',
        timeStamps:false
    })
    DailyProductSalesModel.associate = (Models) => {
        DailyProductSalesModel.belongsTo(Models.Products, {
            foreignKey: 'ProductID',
            targetKey: 'ProductID', 
        });
    }
    return DailyProductSalesModel;
}
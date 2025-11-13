export default (sequelize , DataTypes) => {
    const DailyProductSalesModel = sequelize.define('DailyProductSales', {
        SaleID:{
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
        timestamps:false
    })
    DailyProductSalesModel.associate = (Models) => {
        DailyProductSalesModel.belongsTo(Models.Products, {
            foreignKey: 'ProductID',
            targetKey: 'ProductID', 
        })
        DailyProductSalesModel.belongsTo(Models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return DailyProductSalesModel;
}
export default (sequelize , DataTypes) => {
    const ProductDeliveryTimeModel = sequelize.define('ProductDeliveryTime', {
        ProductID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Products',
                key:'ProductID'
            }
        },
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'organizations',
                key:'organizationId'
            }
        },
        VendorID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Vendors',
                key:'VendorID'
            }
        },
        //Simulation will run before these days to predict stock outage , Calculation: SumOfProductDeliveryTime / NoOfOrders
        AverageDeliverTime:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        //Simulation will assign a value to this column
        AutoOrderQuantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    } , {
        tableName:'ProductDeliveryTime',
        timestamps:true,
        createdAt:false,
        updatedAt:'LastShifted'

    })

    ProductDeliveryTimeModel.associate = (models) => {
        ProductDeliveryTimeModel.belongsTo(models.Products, {
            foreignKey: 'ProductID',
            targetKey: 'ProductID', 
        });
        ProductDeliveryTimeModel.belongsTo(models.Vendors, {
            foreignKey: 'VendorID',
            targetKey: 'VendorID', 
        });
        ProductDeliveryTimeModel.belongsTo(models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return ProductDeliveryTimeModel;
}
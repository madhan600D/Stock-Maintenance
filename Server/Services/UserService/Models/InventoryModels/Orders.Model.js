export default (sequelize , DataTypes) => {
    const OrderModel = sequelize.define('Orders', {
        OrderID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            reference:{
                model:'organizations',
                key:'organizationId'
            }
        },
        VendorID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            reference:{
                model:'Vendors',
                key:'VendorID'
            }
        },
        IsDelivered:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        //Array of JSON containing order details
        OrderJSON:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        OrderCost:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        },
        CurrencyID:{
            
        },
        //Is order active or not, Giving the ability to cancel the order
        Active:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        }
    } , {
        tableName:'Orders',
        timestamps:true,
        createdAt:'OrderPlacedAt',
        updatedAt:false
    })

    OrderModel.associate = (models) => {
        OrderModel.belongsTo(models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
        OrderModel.belongsTo(models.Vendors, {
            foreignKey: 'VendorID',
            targetKey: 'VendorID', 
        });
    }
    return OrderModel;
}
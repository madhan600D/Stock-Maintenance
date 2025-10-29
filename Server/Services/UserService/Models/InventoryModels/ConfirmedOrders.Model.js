export default (sequelize , DataTypes) => {
    const OrderConfirmModel = sequelize.define('OrderConfirm', {
        OrderHistoryID:{
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
        VendorID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Vendors',
                key:'VendorID'
            }
        },
        //Array of JSON containing order details
        OrderJSON:{
            type:DataTypes.STRING,
            allowNull:false,
            get(){
                const rawValue = this.getDataValue("OrderJSON");
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                this.setDataValue("OrderJSON", JSON.stringify(value));
            },
        },
        DaysToDeliver:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        OrderCost:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    } , {
        tableName:'OrderConfirm',
        timestamps:true,
        updatedAt:false,
        createdAt:'OrderDeliveredAt'
    })

    OrderConfirmModel.associate = (models) => { 
        OrderConfirmModel.belongsTo(models.Vendors, {
            foreignKey: 'VendorID',
            targetKey: 'VendorID', 
        });
        OrderConfirmModel.belongsTo(models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return OrderConfirmModel;
}
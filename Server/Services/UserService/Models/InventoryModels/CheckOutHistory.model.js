

//Customer Orders
export default (Sequelize , DataTypes) => {
    const CheckOutHistoryModel = Sequelize.define('CheckOutHistory' , {
    CheckOutHistoryID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'organizations',
            key:'organizationId'
        }
    },
    CheckOutDate:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    NoOfItems:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    //A Array of JSON
    ProductsItems:{
        type:DataTypes.INTEGER,
        allowNull:false,
        get() {
            const RawValue = this.getDataValue("ProductItems")
            return RawValue ? JSON.parse(RawValue) : null;
        },
        set(Value){
            const JsonValue = JSON.stringify(Value) ; 
            setDataValue("ProductItems" , JsonValue);
        }
    },
    TotalCost:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
    },
    {
        timestamps: true,
        createdAt:'CheckOutTime' ,
        updatedAt:false,
        tableName: 'CheckOutHistory',
    } 
    )

    CheckOutModel.associate = (models) => {
        CheckOutModel.belongsTo(models.Category, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return CheckOutModel
    
}
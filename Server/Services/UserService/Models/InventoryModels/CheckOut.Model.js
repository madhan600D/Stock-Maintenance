

//Customer Orders
export default (Sequelize , DataTypes) => {
    const CheckOutModel = Sequelize.define('CheckOuts' , {
    CheckOutID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        reference:{
            model:'organizations',
            key:'organizationId'
        }
    },
    NoOfItems:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    //A Array of JSON
    ProductsItems:{
        type:DataTypes.INTEGER,
        allowNull:false
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
        tableName: 'CheckOuts',
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
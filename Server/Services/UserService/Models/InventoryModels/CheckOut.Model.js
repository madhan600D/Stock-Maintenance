

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
    ProductItems:{
        type:DataTypes.STRING,
        allowNull:false,
            get() {
                const rawValue = this.getDataValue("ProductItems");
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                try {
                    this.setDataValue("ProductItems", JSON.stringify(value));    
                } catch (error) {
                    console.log(error)
                }
                
            },
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
        CheckOutModel.belongsTo(models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return CheckOutModel
    
}
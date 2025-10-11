

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
    CheckOutDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    NoOfItems:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    //A Array of JSON
    ProductsItems:{
        type:DataTypes.STRING,
        allowNull:false,
            get() {
                const rawValue = this.getDataValue("ProductOfItems");
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                this.setDataValue("ProductOfItems", JSON.stringify(value));
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
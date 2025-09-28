
export default (Sequelize , DataTypes) => {
    const PNLModel = Sequelize.define('PNL' , {
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        reference:{
            model:'organizations',
            key:'organizationId'
        }
    },
    TotalExpense:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },
    TotalRevenue:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
}, 
    {
        tablename:'PNL'
    }
)
PNLModel.associate = (models) => {
    PNLModel.belongsTo(models.organizations , {
        foreignKey:'OrganizationID',
        targetKey:'organizationId'
    })
} 
return PNLModel;
}
 


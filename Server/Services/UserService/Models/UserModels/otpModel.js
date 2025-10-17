
export default (Sequelize , DataTypes) => {
    const otpModel = Sequelize.define('OTPS' , {
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        referencess:{
            model:'users',
            key:'userId'
        }
    },
    OneTimePassword:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    GeneratedTime:{
        type:DataTypes.DATE,
        allowNull:false
    },
    WrongAttemptCount:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{
    tableName:'OTPS',
    timestamps:false
}
) 
otpModel.associate = (models) => {
    otpModel.belongsTo(models.users , {
        foreignKey:'userId'
    })
}
return otpModel

}
 

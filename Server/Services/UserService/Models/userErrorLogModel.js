
export default (Sequelize , DataTypes) => {
    const userErrorLogModel = Sequelize.define('UserErrorLog' , {
    errorId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    ErrorDescription:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ClientorServer:{
        type:DataTypes.STRING,
        allowNull:false
    }
    
},
{
    tableName:'UserErrorLog',
    timestamps:true,
    createdAt:true,
    createdAt:'ErrorTime',
    updatedAt:false

}
)
return userErrorLogModel
}
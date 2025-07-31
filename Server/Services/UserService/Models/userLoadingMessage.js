//This model serves data to FallBack React component which display Hint while loading (like Games)
export default (Sequelize , DataTypes) => {
    const userLoadingMessageModel = Sequelize.define('userLoadingMessages' , {
    messageId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    Message:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    logoURL:{
        type:DataTypes.STRING,
        allowNull:false
    },
},
{
    tableName:'userLoadingMessages',
    timestamps:false
}
) 
return userLoadingMessageModel

}
 

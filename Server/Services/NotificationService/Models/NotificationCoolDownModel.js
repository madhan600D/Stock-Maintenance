
export default (Sequelize , DataTypes) => {
    const NotificationCoolDownModel = Sequelize.define('NotificationCoolDown' , 
        {
            UserID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'users',
                    key:'UserID'
                }
            },
            UserName:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            UserMail:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            IsCoolDown:{
                type:DataTypes.BOOLEAN,
                allowNull:false
            }
        },
        {
            tableName:'NotificationCoolDown',
            timestamps:false
        }
    )
    NotificationCoolDownModel.associate = (models) => {
        NotificationCoolDownModel.belongsTo(models.Users , {
            foreignKey: 'UserID', 
            targetKey: 'UserID',   
        }) 
    }
    return NotificationCoolDownModel
}





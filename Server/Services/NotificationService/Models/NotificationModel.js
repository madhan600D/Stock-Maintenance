
export default (Sequelize , DataTypes) => { 
    const NotificationModel = Sequelize.define('Notifications' , 
        {
            NotificationID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                primaryKey:true, 
                autoIncrement:true,
            },
            Subject:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            Body:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            ReceiverID:{
                type:DataTypes.INTEGER,
                allowNull:true,
                reference:{
                    model:'Users',
                    key:'UserID'
                }

            }
        },
        {
            tableName:'Notifications',
            timestamps:true,
            createdAt:'NotificationSentTime',
            updatedAt:false
        }
    )
    NotificationModel.associate = (models) => {
        NotificationModel.belongsTo(models.Users, {
            foreignKey: 'ReceiverID',
            targetKey: 'UserID', 
        });
  };
    return NotificationModel
}





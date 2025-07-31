
export default (Sequelize , DataTypes) => {
    const NotificationDeliveryStatusModel = Sequelize.define('NotificationDeliveryStatus' , 
        {
            NotificationID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                reference:{
                    model:'Notifications',
                    key:'NotificationID'
                },
            },
            Sender:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            ReceiverID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                reference:{
                    model:'Users',
                    key:'UserID'
                }
            },
            DeliveryStatus:{
                type:DataTypes.STRING,
                allowNull:false
            }
        },
        {
            tableName:'NotificationsDeliveryStatus',
            timestamps:true,
            createdAt:'NotificationSentTime',
            updatedAt:false
        }
    )
    NotificationDeliveryStatusModel.associate = (models) =>{
        NotificationDeliveryStatusModel.belongsTo(models.Notifications , {
            foreignKey: 'NotificationID',
            targetKey: 'NotificationID', 
        })
        NotificationDeliveryStatusModel.belongsTo(models.Users , {
            foreignKey:'ReceiverID',
            targetKey:'UserID'
        })
    }
    return NotificationDeliveryStatusModel
}





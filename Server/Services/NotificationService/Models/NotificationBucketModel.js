
export default (Sequelize , DataTypes) => {
    const NotificationBucketModel = Sequelize.define('NotificationBuckets' , 
        {
            UserID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'Users',
                    key:'UserID'
                },
            },
            BucketCreatedTime:{
                type:DataTypes.DATE,
                allowNull:false,
            },
            NotificationsInBucket:{
                type:DataTypes.INTEGER,
                allowNull:false,
            },
        },
        {
            tableName:'NotificationBuckets',
            timestamps:false
        }
    )
    NotificationBucketModel.associate = (models) => {
        NotificationBucketModel.belongsTo(models.Users , {
            foreignKey: 'UserID',
            targetKey: 'UserID', 
        })
    } 
    return NotificationBucketModel
}





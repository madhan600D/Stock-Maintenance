
export default (Sequelize , DataTypes) => {
    const UserModel = Sequelize.define('Users' , 
        {
            UserID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                autoIncrement:true,
                primaryKey:true
            },
            UserName:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            UserMail:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            isActive:{
                type:DataTypes.BOOLEAN,
                allowNull:false
            }
        },
        {
            tableName:'Users',
            timestamps:false
        }
    )
    return UserModel
}





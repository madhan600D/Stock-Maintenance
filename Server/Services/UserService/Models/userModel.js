

export default (Sequelize , DataTypes) => {
    const UserModel = Sequelize.define('user' , 
        {
            userId:{
                type:DataTypes.INTEGER,
                allowNull:false,
                autoIncrement:true,
                primaryKey:true
            },
            organizationId:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'organizations',
                    key:'organizationId'
                }
            },
            userName:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            userMail:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            password:{
                type:DataTypes.STRING,
                allowNull:false
            },
            //This will contain the reference of cloudinary URL
            profilePic:{
                type:DataTypes.STRING
            }
        },
        {
            tableName:'users',
            timestamps:true
        }
    )
    UserModel.associate = (models) => {
        UserModel.belongsTo(models.organizations, {
        foreignKey: 'organizationId',
        targetKey: 'organizationId', 
        });
}
    return UserModel
    
}





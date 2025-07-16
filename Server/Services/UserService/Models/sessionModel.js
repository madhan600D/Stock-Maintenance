
export default (Sequelize , DataTypes) => {
    const sessionModel = Sequelize.define('sessions' , {
    sessionId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'userId'
        }
    },
    loggedInAt:{
        type:DataTypes.DATE,
        allowNull:false,

    },
    loggedOutAt:{
        type:DataTypes.DATE
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
}, 
    {
        tablename:'sessions'
    }
) 
sessionModel.associate = (models) => {
    sessionModel.belongsTo(models.users , {
        foreignKey:'userId'
    })
}
return sessionModel

}
 

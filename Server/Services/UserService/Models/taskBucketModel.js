
export default (Sequelize , DataTypes) => {
    const taskBucketModel = Sequelize.define('TasksBucket' , {
    TaskId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    Task:{
        type:DataTypes.STRING,
        allowNull:false
    },
    TaskStatus:{
        type:DataTypes.STRING,
        allowNull:false
    }
    
},
{
    tableName:'TasksBucket',
    timestamps:true

})
taskBucketModel.associate = (models) =>{
    models.belongsTo(models.users , {
        foreignKey:'userId'
    })
}
}


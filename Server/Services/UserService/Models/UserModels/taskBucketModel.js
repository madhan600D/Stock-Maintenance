
export default (Sequelize , DataTypes) => {
    const taskBucketModel = Sequelize.define('TasksBucket' , {
    TaskId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'userId'
        }
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
    taskBucketModel.belongsTo(models.users , {
        foreignKey:'userId'
    }) 
}
return taskBucketModel
}


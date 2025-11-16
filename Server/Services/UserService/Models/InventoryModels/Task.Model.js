
export default (Sequelize , DataTypes) => {
    const TaskModel = Sequelize.define('Tasks' , {
    TaskID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false, 
        references:{
            model:'organizations',
            key:'organizationId'
        }
    }, 
    TaskType:{
        //Types:JOIN,PROMOTE
        type:DataTypes.STRING,
        allowNull:false
    },
    TargetUserID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'userId'
        }
    },
    IsActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:1
    }
}, 
    {
        tablename:'Tasks',
        createdAt:'TaskCreatedAt',
        updatedAt:'TaskHandledAt'
    }
) 
 TaskModel.associate = (models) => {
    TaskModel.belongsTo(models.organizations , {
        foreignKey:'OrganizationID',
        targetKey:'organizationId'
    });
    TaskModel.belongsTo(models.users , {
        foreignKey:'TargetUserID',
        targetKey:'userId'
    });
}
return TaskModel;

}
 


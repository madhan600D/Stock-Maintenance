

// OrganizationState Model
export default (sequelize , DataTypes) => {
    const OrganizationState = sequelize.define('OrgState', {
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            reference:{
                model:'organizations',
                key:'organizationId' 
            }
        },
        RunDate:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        CurrentDaySales:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ClosingTime:{
            type:DataTypes.TIME,
            allowNull:true
        },
        Weekends:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:"SAT,SUN"
        },
        //Flag used to auto shift org to next day at closing time:true
        AutoDayShiftFlag:{
            type:DataTypes.BOOLEAN,
            allowNull:true
        },
        IsDayClosed:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:0
        }
    } , 
        {tableName:'OrgState',
        timestamps:false,
    }
)
    OrganizationState.associate = (models) => {
        OrganizationState.belongsTo(models.organizations , {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        })
    }
    return OrganizationState
}
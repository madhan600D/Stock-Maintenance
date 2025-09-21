

// OrganizationState Model
export default (sequelize , DataTypes) => {
    const OrganizationState = sequelize.define('OrganizationStates', {
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            reference:{
                model:'organizations',
                key:'organizationId'
            }
        },
        RunDate:{
            type:DataTypes.DATE,
            allowNull:false
        },
        CurrentDaySales:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ClosingTime:{
            type:DataTypes.DATE,
            allowNull:true
        },
        Weekends:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:"SAT#SUN"
        },
        //Flag used to auto shift org to next day at closing time:true
        AutoDayShiftFlag:{
            type:DataTypes.BOOLEAN,
            allowNull:true
        }


    })
}
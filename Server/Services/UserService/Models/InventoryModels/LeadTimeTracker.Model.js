export default (sequelize , DataTypes) => {
    const LeadTimeTrackerModel = sequelize.define('LeadTimeTracker', {
        LeadTimeTrackerID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        VendorID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Vendors',
                key:'VendorID'
            }
        },
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{    
                model:'organizations',
                key:'organizationId'
            }
        },
        AverageLeadTime:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        NoOfRecords:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    } , {
        tableName:'LeadTimeTracker',
        timeStamps:false
    })
    LeadTimeTrackerModel.associate = (Models) => {
        LeadTimeTrackerModel.belongsTo(Models.Vendors, {
            foreignKey: 'VendorID',
            targetKey: 'VendorID', 
        });
        LeadTimeTrackerModel.belongsTo(Models.organizations , {
            foreignKey:'OrganizationID',
            targetKey:'organizationId'
        })
    }
    return LeadTimeTrackerModel;
}
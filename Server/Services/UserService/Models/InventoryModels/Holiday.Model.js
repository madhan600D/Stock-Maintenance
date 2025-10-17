export default (sequelize , DataTypes) => {
    const HolidayModel = sequelize.define('Holidays', {
        HolidayID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        OrganizationID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'organizations',
                key:'organizationId'
            }
        },
        //Array of Holiday Date strings separated by - #
        Holidays:{
            type:DataTypes.STRING,
            allowNull:true
        },
        Year:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    } , {
        tableName:'Holidays',
        timestamps:true,
        createdAt:'HolidayAddedAt',
        updatedAt:'HolidayAlteredAt'
    })

    HolidayModel.associate = (models) => {
        HolidayModel.belongsTo(models.organizations, {
            foreignKey: 'OrganizationID',
            targetKey: 'organizationId', 
        });
    }
    return HolidayModel;
}
// Organization Model
export default (sequelize , DataTypes) => {
    const organizationModel = sequelize.define('organizations', {
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeofBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrganizationJoiningCode:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    timestamps: true, 
    tableName: 'organizations',
  });
  return organizationModel
}
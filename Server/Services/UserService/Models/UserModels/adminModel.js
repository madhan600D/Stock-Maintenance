// admin Model
export default (sequelize , DataTypes) => {
    const adminModel = sequelize.define('admin', {
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      referencess: {
        model:'organizations',
        key:'organizationId'
      },
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      }},
    organizationName:{
        type:DataTypes.STRING, 
        allowNull:false
    },
    
  }, {
    timestamps: false, 
    tableName: 'admins',
  });

  adminModel.associate = (models) => {
    adminModel.belongsTo(models.users, {
      foreignKey: 'adminId',
      targetKey: 'userId', 
    });
    adminModel.belongsTo(models.organizations, {
      foreignKey: 'organizationId',
      targetKey: 'organizationId', 
    });
  };
  return adminModel
}
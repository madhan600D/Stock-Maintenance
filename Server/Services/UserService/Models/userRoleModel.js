export default (sequelize, DataTypes) => {
  // UserRole Model
  const UserRoleModel = sequelize.define('roles', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    roleId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'organizations',
        key: 'organizationId',
      },
    },
  }, { 
    tableName: 'roles',
    timeStamps:false
  });
 
  UserRoleModel.associate = (models) => {
    UserRoleModel.belongsTo(models.users, {
      foreignKey: 'userId', 
    });
    UserRoleModel.belongsTo(models.organizations, {
      foreignKey: 'organizationId',
    });
  }; 

  return UserRoleModel;
};

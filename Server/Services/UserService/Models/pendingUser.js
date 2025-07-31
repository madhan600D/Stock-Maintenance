// Organization Model
export default (sequelize , DataTypes) => {
    const pendingUserModel = sequelize.define('pendingUsers', {
    reqID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userMail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    verificationHash:{
      type:DataTypes.STRING,
      allowNull:true
    }
    
  }, {
    // timestamps: true, 
    tableName: 'pendingUsers',
    createdAt: 'CreatedTime'
  });
  return pendingUserModel
}
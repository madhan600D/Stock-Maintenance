// Organization Model
export default (sequelize , DataTypes) => {
    const LoadingTextsModel = sequelize.define('LoadingTexts', {
    TextID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
    tableName: 'LoadingTexts',
  });
  return LoadingTextsModel;
}
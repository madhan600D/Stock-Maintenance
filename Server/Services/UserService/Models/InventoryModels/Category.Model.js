// admin Model
export default (sequelize , DataTypes) => {
    const CategoryModel = sequelize.define('Category', {
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true
    },
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        referencess:{
            model:'organizations',
            key:'organizationId'
        }
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CategoryDescription:{
        type:DataTypes.STRING, 
        allowNull:false
    },
    CategoryImage:{
        type:DataTypes.STRING,
        allowNull:true
    }
    
  }, {
    timestamps: true,
    createdAt:'CategoryCreatedAt' ,
    updatedAt:false,
    tableName: 'Category',
  });
  CategoryModel.associate = (model) => {
    CategoryModel.belongsTo(model.organizations , {
        foreignKey: 'OrganizationID',
        targetKey: 'organizationId', 
    })
  }
  return CategoryModel
}
// admin Model
export default (sequelize , DataTypes) => {
    const ProductModel = sequelize.define('Products', {
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrenent:true
    },
    OrganizationID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        reference:{
            model:'organizations',
            key:'organizationId'
        }
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CategoryID:{
        type:DataTypes.STRING, 
        allowNull:false,
        reference:{
            model:'Category',
            key:'CategoryID'
        }
    },
    ProductImage:{
        type:DataTypes.STRING,
        allowNull:true
    },
    VendorID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        reference:{
            model:'Vendors',
            key:'VendorID'
        }
    },
    IsExpired:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    ExpirationDate:{
        type:DataTypes.DATE,
        allowNull:false,
        
    },
    ProductThreshold:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    Quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
    
  }, {
    timestamps: true,
    createdAt:'ProductedAddedAt' ,
    updatedAt:false,
    tableName: 'Products',
  } , 
 );
    ProductModel.associate = (models) => {
        ProductModel.belongsTo(models.Category, {
            foreignKey: 'CategoryID',
            targetKey: 'CategoryID', 
        });
        ProductModel.belongsTo(models.Vendors, {
            foreignKey: 'VendorID',
            targetKey: 'VendorID', 
        });
        ProductModel.belongsTo(model.organizations , {
            foreignKey:'OrganizationID',
            targetKey:'organizationId'
        })
  }
  return ProductModel
}
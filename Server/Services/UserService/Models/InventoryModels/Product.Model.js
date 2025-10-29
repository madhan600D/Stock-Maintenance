// Product Model
export default (sequelize , DataTypes) => {
    const ProductModel = sequelize.define('Products', {
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProductPrice:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    CurrencyID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Currency',
            key:'CurrencyID'
        }
    },
    //Price the vendor charged
    ActualPrice:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    CategoryID:{
        type:DataTypes.INTEGER, 
        allowNull:false,
        references:{
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
        references:{
            model:'Vendors',
            key:'VendorID'
        }
    },
    IsExpired:{
        type:DataTypes.BOOLEAN,
        allowNull:true,

    },
    ExpirationDate:{
        type:DataTypes.DATEONLY,
        allowNull:true,
        
    },
    ReorderThreshold:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    Unit:{
        type:DataTypes.STRING,
        allowNull:false
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
        ProductModel.belongsTo(models.organizations , {
            foreignKey:'OrganizationID',
            targetKey:'organizationId'
        });
        ProductModel.belongsTo(models.Currency , {
            foreignKey:'CurrencyID',
            targetKey:'CurrencyID'
        })
  }
  return ProductModel
}
// admin Model
export default (sequelize , DataTypes) => {
    const VendorModel = sequelize.define('Vendors', {
    VendorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true
    },
    VendorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    VendorLocation:{
        type:DataTypes.STRING, 
        allowNull:false
    },
    API_Email:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:'-'
    },
    VendorAPI:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'-'
    },
    
  }, {
    timestamps: true,
    createdAt:'VendorCreatedAt' ,
    updatedAt:false,
    tableName: 'Vendor',
  });

  return VendorModel
}
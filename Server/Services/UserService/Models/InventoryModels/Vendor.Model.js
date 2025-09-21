// admin Model
export default (sequelize , DataTypes) => {
    const VendorModel = sequelize.define('Vendors', {
    VendorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrenent:true
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
        allowNull:true
    },
    VendorAPI:{
        type:DataTypes.STRING,
        allowNull:false
    },
    
  }, {
    timestamps: true,
    createdAt:'VendorCreatedAt' ,
    updatedAt:false,
    tableName: 'Vendor',
  });

  return VendorModel
}
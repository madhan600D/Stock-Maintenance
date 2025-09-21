
export default (Sequelize , DataTypes) => {
    const roleDetailsModel = Sequelize.define('RoleDetails' , {
    //Here RoleID is the heirarchy
    RoleID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    RoleName:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    //Array of json [{User:['ADD' , 'DELETE' , 'UPDATE']}]
    Permissions:{
        type:DataTypes.STRING,
        allowNull:false,
            get() {
                const rawValue = this.getDataValue("Permissions");
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                this.setDataValue("Permissions", JSON.stringify(value));
            },
    },
    ScreensAccess:{
        type:DataTypes.STRING,
        allowNull:false,
    }
}, 
    {
        tablename:'RoleDetails',
        timestamps:false
    }
) 
return roleDetailsModel;

}
 

export default (Sequelize , DataTypes) => {
    const ConfigurationSettingsModel = Sequelize.define('ConfigurationSetting' , 
        {
            configId:{
                type:DataTypes.INTEGER,
                allowNull:false,
                autoIncrement:true,
                primaryKey:true
            },
            configName:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            configDescription:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            configValue:{
                type:DataTypes.STRING,
                allowNull:false
            }
        },
        {
            tableName:'ConfigurationSettings',
            timestamps:false
        }
    )
    return ConfigurationSettingsModel
}





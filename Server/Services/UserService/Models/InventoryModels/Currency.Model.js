export default (sequelize , DataTypes) => {
    const CurrecnyModel = sequelize.define('Currency', {
        CurrencyID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true, 
            autoIncrement:true
        },
        CurrencyName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        CurrencySymbol:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        
    } , {
        tableName:'Currency',
        timestamps:false,

    })
    return CurrecnyModel
}
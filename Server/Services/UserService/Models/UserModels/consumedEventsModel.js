
export default (Sequelize , DataTypes) => {
    const ConsumedEventsModel = Sequelize.define('ConsumedEvents' , 
        {
            ConsumedEventID:{
                type:DataTypes.INTEGER,
                allowNull:false,
                autoIncrement:true,
                primaryKey:true
            },
            Topic:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            Event:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            //Optional
            ResponseID:{
                type:DataTypes.STRING,
                allowNull:true
            },
            IsSuccess:{
                type:DataTypes.BOOLEAN,
                allowNull:false
            },
            Error:{
                type:DataTypes.STRING,
                allowNull:true
            }
        },
        {
            tableName:'ConsumedEvents',
            createdAt:'EventConsumedAt',
            updatedAt:false
        }
    )
    return ConsumedEventsModel
}





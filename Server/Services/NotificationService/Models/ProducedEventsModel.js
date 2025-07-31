
export default (Sequelize , DataTypes)  => {
    const ProducedEventsModel = Sequelize.define('ProducedEvents' , 
        {
            ProducedEventID:{
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
            IsResponseReceived:{
                type:DataTypes.BOOLEAN,
                allowNull:false
            }
        },
        {
            tableName:'ProducedEvents',
            createdAt:'EventProducedAt',
            updatedAt:false
        }
    )
    return ProducedEventsModel
}





export class KafkaConsumer{
    constructor(Kafka , DataBase , Topic , ConsumerGroup){
        try {
            this.NotificationConsumer = Kafka.consumer({groupId:ConsumerGroup})
            this.DataBase = DataBase
            this.Topic = Topic
        } catch (error) {
            console.log("Error while instantiating consumer")
        }
    }
    ConnectToBroker = async () => {
        try {
            const IsConnected = await this.NotificationConsumer.connect()
            console.log("Consumer connected to broker!")
        } catch (error) {
            console.log("Error while connecting to broker")
        }
    }   
    SubscribeToTopic = async () => {
        try {
            const IsSubscribed = await this.NotificationConsumer.subscribe({ topic: this.Topic, fromBeginning: false })
        } catch (error) {
            console.log(`Error while Subscribing to ${this.Topic} Topic`)
        }
    }
    ListenForEvents = async (CallBack) => {
        try {
            await this.NotificationConsumer.run({
            eachMessage: async ({ topic, partition, message }) => 
            {   
                const ParsedData = JSON.parse(message.value.toString())
                console.log(`Notification Service got a event: ${topic} and message`)
                
                const IsSuccess = await CallBack(topic , partition , ParsedData)
                await this.LogEvents(ParsedData , IsSuccess)
            },
            })

        } catch (error) {
            console.log(`Error while listening to events from --${this.Topic}-- Topic`)
        }
    }
    LogEvents = async (Event , IsSuccess) => {
        try {
            const NewConsumerLog = await this.DataBase.ConsumedEvents.create({
                Topic:this.Topic , 
                Event:JSON.stringify(Event),
                ResponseID:Event.EventID,
                IsSuccess:IsSuccess.success,
                Error:IsSuccess.success == false ? IsSuccess.message : "Handled"
            })
        } catch (error) {
            console.log("Erorr while logging event" + Event.Event)
        }
    }
}
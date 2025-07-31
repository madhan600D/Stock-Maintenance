

export class KafkaConsumer{
    constructor(Kafka , DataBase , Topic){
        try {
            this.NotificationConsumer = Kafka.consumer({groupId:'NotificationService'})
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
                console.log(`Notification Service got a event: ${topic} and message: ${ParsedData}`)
                CallBack(topic , partition , ParsedData)
            },
            })

        } catch (error) {
            console.log(`Error while listening to events from --${this.Topic}-- Topic`)
        }
    }
    LogEvents = async () => {

    }
}
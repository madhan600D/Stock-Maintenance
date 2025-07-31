import { objNotificationDB } from '../../Utils/NotificationDB.js'
import {kafka} from '../kafka.config.js'
export class KafkaProducer{
    constructor(kafka , DataBase){
        this.UserProducer = kafka.producer()
        this.DataBase = DataBase
    }
    ConnectProducer = async () => {
        try {
            this.UserProducer.connect()
            console.log("Producer connected successfully")
        } catch (error) {
            console.log("Error while connecting to kafka broker (Producer)")
        }
    } 
    ProduceEvent = async (EventType , Topic , Event) => {
        try {   
            const EventID = await this.LogEvent(Topic , Event)
            const EventToSend = {EventID:EventID , ...Event}
            if(EventID){
                await this.UserProducer.send({
                topic: Topic,
                messages: { key: EventType.toString(), value: JSON.stringify(EventToSend) }
            })
            return true
            }
            else{
                return false
            }
            
        } catch (error) {
            console.log(`Error while Producing an event to kafka topic: ${Topic}`)
        }
    }
    LogEvent = async (topic , event) => {
        try {
            const ProducedEvent = await this.DataBase.ProduceEvent.create({
                Topic:topic,
                Event:event,
                IsResponseReceived:false
            })
            return ProducedEvent.ProducedEventID
        } catch (error) {
            console.log("Error while logging producer Data " + error)
        }
    }
}

//Instantiate Kafka Producer Object
export const ObjNotificationKafkaProducer = new KafkaProducer(kafka , objNotificationDB)

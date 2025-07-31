import { kafka } from "../kafka.config.js";
import { KafkaConsumer } from "../Consumer/KafkaConsumer.js";
import {objNotificationDB} from '../../Utils/NotificationDB.js'
import {CreateUserController} from '../../Controller/UserCreation.controller.js'

export let KafkaConsumers = new Map()

//#region "Instantiate Kafka Consumer {user.create_user.request}"
const ObjKafkaConsumerCreateUser = new KafkaConsumer(kafka , objNotificationDB , 'user.create_user.request')
KafkaConsumers.set(ObjKafkaConsumerCreateUser , CreateUserController)
//#endregion

export async function InitializeKafkaConsumers(AllKafkaConsumers){
  try {
    AllKafkaConsumers.forEach(async (KafkaController , KafkaConsumerObject) => {  
        await KafkaConsumerObject.ConnectToBroker()
        await KafkaConsumerObject.SubscribeToTopic()
        await KafkaConsumerObject.ListenForEvents(KafkaController)
        console.log(`Kafka started listening to topic: ${KafkaConsumerObject.Topic}`)
    })
  } catch (error) {
    console.log("Error while instantiating kafka consumer" + error) 
  }
}

 
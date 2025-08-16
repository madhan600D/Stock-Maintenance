import { kafka } from "../kafka.config.js";
import { KafkaConsumer } from "../Consumer/KafkaConsumer.js";
import {objNotificationDB} from '../../Utils/NotificationDB.js'
import {CreateUserController} from '../../Controller/UserCreation.controller.js'
import {ConfirmUserController} from '../../Controller/ConfirmUser.controller.js'

export let KafkaConsumers = new Map()


const DeclareKafkaConsumers = async () => {
  //#region "Instantiate Kafka Consumer {user.create_user.request}"
  const ObjKafkaConsumerCreateUser =  await new KafkaConsumer(kafka , objNotificationDB , 'user.create_user.request' , "CreateUserRequest")
  KafkaConsumers.set(ObjKafkaConsumerCreateUser , CreateUserController)

  const ObjKafkaConsumerConfirmUser = await new KafkaConsumer(kafka , objNotificationDB , 'user.confirm_user.request' , "ConfirmUserRequest");
  KafkaConsumers.set(ObjKafkaConsumerConfirmUser , ConfirmUserController)
  
  const ObjKafkaConsumerGroupMail = await new KafkaConsumer(kafka , objNotificationDB , "user.group_mail" , "Group_Mail");
  KafkaConsumers.set(ObjKafkaConsumerGroupMail , )
    //#endregion
}

//This makes listed kafka consumers to listen for events from mentioned topics
export async function InitializeKafkaConsumers(AllKafkaConsumers){
  try {
    await DeclareKafkaConsumers()
    await AllKafkaConsumers.forEach(async (KafkaController , KafkaConsumerObject) => {  
        await KafkaConsumerObject.ConnectToBroker()
        await KafkaConsumerObject.SubscribeToTopic()
        await KafkaConsumerObject.ListenForEvents(KafkaController)
        console.log(`Kafka started listening to topic: ${KafkaConsumerObject.Topic}`)
    })
  } catch (error) {
    console.log("Error while instantiating kafka consumer" + error) 
  }
}

 
import express from 'express';
import dotenv from 'dotenv';
import {objNotificationDB} from './Utils/NotificationDB.js'
import {ObjNotificationKafkaProducer} from './Kafka/Producer/KafkaProducer.js'
import {KafkaConsumers , InitializeKafkaConsumers} from './Kafka/KafkaHandlers/UserCreation.handler.js'
dotenv.config();

const NotificationServer = express();
const port = process.env.userPort;


const StartUp = async () => {
  try {
    await objNotificationDB.connectDB()
    await ObjNotificationKafkaProducer.ConnectProducer()
    await InitializeKafkaConsumers(KafkaConsumers)
    console.log("Notifications Service started Successfully ...!")
    //Listen for all Kafka Events
    //1.
    

    //2.
  } catch (error) {
    
  }
}

try {
    await StartUp()
} catch (error) {
  console.error("Error initiating server:", error);
}



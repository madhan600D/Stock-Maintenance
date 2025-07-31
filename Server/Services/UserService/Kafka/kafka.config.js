import {Kafka} from 'kafkajs';
import dotenv from 'dotenv'

dotenv.config()
const KafkaBrokerMetaData = process.env.Kafka_Config


export const kafka = new Kafka ({
    clientId:'user-service',
    brokers:[KafkaBrokerMetaData]
})

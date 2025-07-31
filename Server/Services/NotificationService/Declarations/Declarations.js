import {PushMail} from '../NodeMailer/PushNotification.class.js'
import { PublicConfigVariables } from '../Classes/Configuration.class.js'
import { UserCreation } from '../Classes/UserCreation.class.js'
import dotenv from 'dotenv'
import { objNotificationDB } from '../Utils/NotificationDB.js'

dotenv.config()

//#region "Environment Variables"
export let ENV_NotificationDB_Name = 'NotificationServer'
export let ENV_NotificationDB = 'Password@12345'
export let ENV_VerificationEndpoint = 'http://localhost:5000/api/userservice/email-confirm'
//#endregion

//#region "Objects"
export let ObjPublicConfigVariables = new PublicConfigVariables()
await ObjPublicConfigVariables.FillConfigFromDataBase()
//#endregion
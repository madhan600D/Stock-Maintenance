import { objNotificationDB } from "../Utils/NotificationDB.js"
export class PublicConfigVariables{
    constructor()
    {
        this.MailBucketLimit
        this.MailBucketCoolDownTime
        this.DateTimeOptions = {dateStyle: 'short', timeStyle: 'short', hour12: false}
    }
    FillConfigFromDataBase =  async () => {
        try {
            const ConfigData =  await objNotificationDB.ConfigurationSettings.findAll()
            this.MailBucketLimit = ConfigData.find(configs => configs.configName == "MailBucketLimit").configValue
            this.MailBucketCoolDownTime = ConfigData.find(configs => configs.configName == "MailBucketCoolDownTime").configValue ;
        } catch (error) {
            console.log("Error while setting configurationSettings"  + `${error}`)
        }
    }
    UpdateConfigfromDatabase = async (ConfigName) => {
        try {
            const ConfigData = objNotificationDB.findOne({where:{ConfigName:ConfigName}})
            
        } catch (error) {
            console.log("Error while setting configurationSettings"  + `${error}`)
        }
    }
}

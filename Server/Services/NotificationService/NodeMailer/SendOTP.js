import { PushMail } from "./PushNotification.class";
import { ImportEmailHTML } from "./MailTemplate.js"
export class PushOTP extends PushMail{
    //Need to pass {UserMail , UserN?ame}
    constructor(UserMail , UserName){
        super({})
        this.ParentMailOptions.to = UserMail
        this.ParentMailOptions.UserName = UserName
    }
    PrepareHTML = async (OneTimePassword) => {
        try {
            let OTPEmailHTML  = await ImportEmailHTML('OTP')
            OTPEmailHTML = OTPEmailHTML.replace('{user}' , this.ParentMailOptions.UserName.toString().toUpperCase())
            OTPEmailHTML = OTPEmailHTML.replace('{OTP}', OneTimePassword)
            this.ParentMailOptions.subject = 'Forgot Password OTP'
            this.ParentMailOptions.html = OTPEmailHTML
            return {success:true , message:'OTP Email Done'}
        } catch (error) {
            console.log("Error while preparing HTML at PUSH OTP")
        }
    }
}
import { GroupMail } from "../NodeMailer/PushGroupNotification.js";

//Classes
import { ImportEmailHTML } from "../NodeMailer/MailTemplate.js"
export class GroupInvitation{
    constructor(GroupOfUsers , Organization , UserData){
        //1.Initialize the GroupMail class
        //2.Prepare HTML for individual users
        //3.Send Mail
        //Initializaing Push Mail class
        //Array of objects{to , subject , HTML}
        //Organization(OrganizationJoiningCode , OrganizationName)
        this.GroupOfUsers = GroupOfUsers;
        this.Organization = Organization;
        this.UserData = UserData;
        this.ObjGroupMail = new GroupMail([] , UserData);
    }
    SendGroupInvitation = async () => {

        let InvitationHTMLTemplateGlobal = await ImportEmailHTML('Invitation');
        let MailObjectArray = []
        for(let EmailIndex = 0 ; EmailIndex <= this.GroupOfUsers.length - 1 ; EmailIndex += 1){
            //1.Prepare HTML
            //2.Add UserMail to GroupMail class
            let MailObject = {}
            let InvitationHTMLTemplateLocal = InvitationHTMLTemplateGlobal
            this.PrepareHTML(InvitationHTMLTemplateLocal , this.Organization , this.GroupOfUsers[EmailIndex] , "TBD" , MailObject);
            //Initializting Group Mail object
            MailObjectArray.push(MailObject);
        }
        //Sender
        this.ObjGroupMail.UserData = this.UserData;
        //Push group mail
        this.ObjGroupMail.ParentMailOptions = MailObjectArray

        const IsGroupInvitationSent = await this.ObjGroupMail.PushGroupMail();
        if(IsGroupInvitationSent.success){
            return {success:true}
        }
        else{
            return {success:false}
        }
    }
    PrepareHTML = async (HTML , Organization  , Email , URL , MailObject) => {
        try {
            HTML = HTML.replace('{Email}' , Email.toString().toLowerCase());
            HTML = HTML.replace('{Organization}', Organization.OrganizationName);
            HTML = HTML.replace('{URL}' , URL);
            HTML = HTML.replace('{OTP}' , Organization.OrganizationJoiningCode);
            MailObject.subject = `Email Invitation to join ${Organization.OrganizationName}`;
            MailObject.html = HTML
            MailObject.to = Email
        } catch (error) {
            console.log("Error at SendGroupInvite class:", error);
            return false
        }
    }
}
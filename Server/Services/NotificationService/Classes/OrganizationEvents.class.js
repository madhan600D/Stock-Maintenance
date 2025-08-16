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
        this.GroupOfUsers = GroupOfUsers;
        this.Organization = Organization;
        this.UserData = UserData;
    }
    SendGroupInvitation = async (From) => {
        let ObjGroupMail = new GroupMail([] , From);
        let InvitationHTMLTemplateGlobal = await ImportEmailHTML('Invitation');
        for(let EmailIndex = 0 ; EmailIndex <= this.GroupOfUsers.length - 1 ; EmailIndex += 1){
            //1.Prepare HTML
            //2.Add UserMail to GroupMail class
            InvitationHTMLTemplateGlobal = ''
            this.PrepareHTML(InvitationHTMLTemplateGlobal , this.Organization , this.GroupOfUsers[EmailIndex].UserMail , "TBD" , EmailIndex);
            //Initializting Group Mail object
            ObjGroupMail.ParentMailOptions.push(GroupOfUsers[EmailIndex]);
        }
        ObjGroupMail.UserData = this.UserData;
        //Push group mail
        const IsGroupInvitationSent = await ObjGroupMail.PushGroupMail;
        if(IsGroupInvitationSent.success){
            return {success:true}
        }
        else{
            return {success:false}
        }
    }
    PrepareHTML = async (HTML , Organization , Email , URL , Index) => {
        try {
            HTML = HTML.replace('{Email}' , Email.toString().toLowerCase());
            HTML = HTML.replace('{Organization}', Organization);
            HTML = HTML.replace('{URL}' , URL);
            this.GroupOfUsers[Index].subject = `Email Invitation to join ${Organization}`;
            this.GroupOfUsers[Index].html = HTML
        } catch (error) {
            console.log("Error at SendGroupInvite class:", error)
            return false
        }
    }
}
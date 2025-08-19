import express from 'express'
import { joinOrg ,  createOrg , groupInviteToOrg} from '../Controller/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import {CreateOrgValidate , GroupInviteToOrgValidate} from '../MiddleWares/EndPointValidations/Org.validate.js'

const organizationRouter = express.Router() ; 

organizationRouter.put('/join-org' , cookieValidation , joinOrg)

organizationRouter.put('/create-org' , cookieValidation , CreateOrgValidate , createOrg);

organizationRouter.put('/group-invite-mail' , cookieValidation , GroupInviteToOrgValidate , groupInviteToOrg);

export default organizationRouter;
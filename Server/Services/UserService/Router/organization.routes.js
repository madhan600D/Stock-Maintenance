import express from 'express'
import { joinOrg ,  createOrg , groupInviteToOrg , getOrganizations} from '../Controller/UserControllers/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import {CreateOrgValidate , GroupInviteToOrgValidate} from '../MiddleWares/EndPointValidations/UserEndPointValidations/Org.validate.js'

const organizationRouter = express.Router() ; 

organizationRouter.put('/join-org' , cookieValidation , joinOrg)

organizationRouter.put('/create-org' , cookieValidation , CreateOrgValidate , createOrg);

organizationRouter.put('/group-invite-mail' , cookieValidation , GroupInviteToOrgValidate , groupInviteToOrg);

organizationRouter.get('/get-organizations' , cookieValidation , getOrganizations)

export default organizationRouter;
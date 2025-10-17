import express from 'express'
import { joinOrg ,  createOrg , groupInviteToOrg , getOrganizations , getOrganizationData} from '../Controller/UserControllers/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import {CreateOrgValidate , GroupInviteToOrgValidate} from '../MiddleWares/EndPointValidations/UserEndPointValidations/Org.validate.js'

const organizationRouter = express.Router() ; 
//Middleware
organizationRouter.use(cookieValidation);

organizationRouter.put('/join-org'  , joinOrg)

organizationRouter.put('/create-org' , CreateOrgValidate , createOrg);

organizationRouter.put('/group-invite-mail' , GroupInviteToOrgValidate , groupInviteToOrg);

organizationRouter.get('/get-organizations' , getOrganizations)

organizationRouter.get('/fill-organization-data' , getOrganizationData)
export default organizationRouter;
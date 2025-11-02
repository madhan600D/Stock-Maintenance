import express from 'express'
import { joinOrg ,  createOrg , groupInviteToOrg , getOrganizations , getOrganizationData, ManualCloseDay} from '../Controller/UserControllers/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import {CloseDayValidate, CreateOrgValidate , GroupInviteToOrgValidate} from '../MiddleWares/EndPointValidations/UserEndPointValidations/Org.validate.js'

const organizationRouter = express.Router() ; 
//Middleware
organizationRouter.use(cookieValidation);

//Routers
organizationRouter.put('/join-org'  , joinOrg)
organizationRouter.put('/create-org' , CreateOrgValidate , createOrg);
organizationRouter.put('/group-invite-mail' , GroupInviteToOrgValidate , groupInviteToOrg);
organizationRouter.get('/get-organizations' , getOrganizations)
organizationRouter.get('/fill-organization-data' , getOrganizationData)

//Functionalities
organizationRouter.get('/close-day' , CloseDayValidate ,ManualCloseDay);
export default organizationRouter;
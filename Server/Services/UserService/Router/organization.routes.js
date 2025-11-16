import express from 'express'
import { joinOrg ,  createOrg , groupInviteToOrg , getOrganizations , getOrganizationData, ManualCloseDay, GetRole} from '../Controller/UserControllers/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import {CloseDayValidate, CreateOrgValidate , GroupInviteToOrgValidate, LeaveOrgValidate} from '../MiddleWares/EndPointValidations/UserEndPointValidations/Org.validate.js'
import { LeaveOrg } from '../Controller/UserControllers/userCredentials.controller.js';
import { GetUsers } from '../Controller/InventoryControllers/UserManagement.controller.js';

const organizationRouter = express.Router() ; 
//Middleware
organizationRouter.use(cookieValidation);

//Routers
organizationRouter.put('/join-org'  , joinOrg)
organizationRouter.put('/create-org' , CreateOrgValidate , createOrg);
organizationRouter.put('/group-invite-mail' , GroupInviteToOrgValidate , groupInviteToOrg);
organizationRouter.get('/get-organizations' , getOrganizations)
organizationRouter.get('/fill-organization-data' , getOrganizationData)
organizationRouter.get('/get-role' , GetRole);
organizationRouter.get('/leave-org', LeaveOrgValidate, LeaveOrg);
organizationRouter.get('/get-org-users' , GetUsers);

//Functionalities
organizationRouter.get('/close-day' , CloseDayValidate ,ManualCloseDay);
export default organizationRouter;
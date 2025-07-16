import express from 'express'
import { joinOrg ,  createOrg} from '../Controller/organization.controller.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';

const organizationRouter = express.Router() ; 

organizationRouter.put('/join-org' , cookieValidation , joinOrg)
organizationRouter.put('/create-org' , cookieValidation , createOrg)

export default organizationRouter;
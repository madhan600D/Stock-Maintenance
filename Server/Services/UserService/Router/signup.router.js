import express from 'express'
import {signUpUser , logInUser, LogOutUser} from '../Controller/userCredentials.controller.js'
import {sendResetMail , changerUserPassword} from '../Controller/passwordResetMail.controller.js'
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import { cookieValidation } from '../MiddleWares/cookieValidation.js';

const signUpRouter = express.Router() ; 

signUpRouter.put('/signup' , signUpUser)

signUpRouter.get('/login', logInUser)

signUpRouter.get('/forget-password-mail' , sendResetMail);

signUpRouter.patch('/validate-otp' , changerUserPassword)

signUpRouter.get('/logout' , cookieValidation , LogOutUser)
 
export default signUpRouter;
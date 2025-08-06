import express from 'express'
import {signUpUser , logInUser, LogOutUser , eMailConfirm , addUser} from '../Controller/userCredentials.controller.js'
import {sendResetMail , changerUserPassword} from '../Controller/passwordResetMail.controller.js'
import { cookieValidation } from '../MiddleWares/cookieValidation.js';

//Validation MiddleWares
import {signUpUserValidation , AddUserValidation} from '../MiddleWares/EndPointValidations/NewUser.validate.js'

const signUpRouter = express.Router() ; 

signUpRouter.put('/signup', signUpUserValidation , signUpUser)

signUpRouter.get('/login' , logInUser)

signUpRouter.get('/forget-password-mail' , sendResetMail);

signUpRouter.patch('/validate-otp' , changerUserPassword)

signUpRouter.get('/logout' , cookieValidation , LogOutUser)
 
signUpRouter.get('/email-confirm' , eMailConfirm)

signUpRouter.put('/add-user',AddUserValidation, addUser)

export default signUpRouter;
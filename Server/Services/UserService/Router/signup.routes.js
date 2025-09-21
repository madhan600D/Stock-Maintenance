import express from 'express'
import {signUpUser , logInUser, LogOutUser , eMailConfirm , addUser , ValidateUser , GetLoadingTexts} from '../Controller/UserControllers/userCredentials.controller.js'
import {sendResetMail , changerUserPassword} from '../Controller/UserControllers/passwordResetMail.controller.js'

import { cookieValidation } from '../MiddleWares/cookieValidation.js';

//Validation MiddleWares
import {signUpUserValidation , AddUserValidation} from '../MiddleWares/EndPointValidations/UserEndPointValidations/NewUser.validate.js'

const signUpRouter = express.Router() ; 

signUpRouter.put('/signup', signUpUserValidation , signUpUser)

signUpRouter.post('/login' , logInUser)

signUpRouter.get('/forget-password-mail' , sendResetMail);

signUpRouter.patch('/validate-otp' , changerUserPassword)

signUpRouter.get('/logout' , cookieValidation , LogOutUser)
 
signUpRouter.get('/email-confirm' , eMailConfirm)

signUpRouter.put('/add-user',AddUserValidation, addUser)

signUpRouter.get('/validate-user', cookieValidation , ValidateUser)

signUpRouter.get('/get-loadingtexts' , GetLoadingTexts)


export default signUpRouter;
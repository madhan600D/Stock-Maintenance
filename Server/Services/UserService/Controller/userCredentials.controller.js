//import models
import bcrypt from 'bcryptjs'
import objUserDb from '../Utils/userDB.js'
import { GenerateJWT } from '../Utils/GenerateJWT.js'
import { TimeFormatter } from '../Utils/timeFormatter.js'
import { Op } from 'sequelize'
export const signUpUser = async (req , res) => {
    try { 
        //We need to get userName ,userMail ,profilePic (optional),organizationIf exist or get 0 as org Id for new organization
        let organization = req.body.organizationName
        //regex states : one upper case , one number  , one special character
        const Passwordregex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        const userNameRegex = /^[a-zA-Z0-9]+$/

        //New organization user 
        const allOrganizations = await objUserDb.organizations.findAll({attributes: ['organizationId' , 'organizationName']})
        if(!allOrganizations.includes(organization)){
            //Feature TBD: send a call to mail service to get confirmation from admin.
            const isUserNameTaken = await objUserDb.users.findOne({where: {userName:req.body.userName}})
            const isMailIdTaken = await objUserDb.users.findOne({where:{userMail:req.body.userMail}})

            if(typeof req.body.userName !== 'string' || isUserNameTaken || isMailIdTaken){
                return res.status(400).json({success:false , message:'userName or MailId is invalid or already present'})
            }

            if(! userNameRegex.test(req.body.userName)){
                return res.status(400).json({success:false , message:"Invalid user name [a-z] & [0-9] are allowed"})
            }             

            if(req.body.password.length < 6 || ! Passwordregex.test(req.body.password)){
                return res.status(400).json({success:false , message:'Enter a strong password(One upper case , One Number & One special charcter)'})
            }
            if(req.body.password.length > 20){
                return res.status(400).json({success:false , message:'Enter a shorter password (maximum 20 characters)'})
            }
            //Hash the password
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(req.body.password , passwordSalt)

            const newUser = await objUserDb.users.create({
                userName:req.body.userName.toLowerCase(), 
                password:passwordHash,
                userMail:req.body.userMail, 
                profilePic:req.body?.profilePic,
                organizationId:req.body.organizationId 
            }
            )
            const JwtToken = GenerateJWT(newUser.userId)
            //Add session Data
            const currentTime = Date.Now()
            await objUserDb.sessions.create({userId:newUser.userId , loggedInAt:TimeFormatter(currentTime) , LoggedOutAt:'' , isActive:true})
            return res.cookie("jwt",
                JwtToken , {
                    maxAge: 60 * 60 * 1000,
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",})
                .status(200)
                .json({success:true , message:'User created successfully'})
            }
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:"(Server Side)Error while creating a user...!"})
    }
}
export const logInUser = async (req , res) => {
    try {
        const userName = req.body.userName.toString() , userPassword = req.body.password , userMail = req.body?.userMail || '';
        const userCredentials = await objUserDb.users.findOne({where:{[Op.or]:{userName:userName , userMail:userMail}}})
        if(userCredentials.userName || userCredentials.userMail){
            
            //Password Validation
            //Hash the password
            const isPasswordCorrect = await bcrypt.compare(userPassword , userCredentials.password);
            if(!isPasswordCorrect){
                return res.status(400).json({success:false , message:"Incorrect password for entered UserName...!"})
            }
            const JwtToken = await GenerateJWT(userCredentials)
            const currentTime = new Date()
            await objUserDb.sessions.create({userId:userCredentials.userId , loggedInAt:TimeFormatter(currentTime) , LoggedOutAt:'' , isActive:true})
            return res.cookie("jwt",
                JwtToken , {
                    maxAge: 60 * 60 * 1000,
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",})
                .status(200)
                .json({success:true , message:'User logged-IN successfully'})
        }

        else{
            return res.status(400).json({success:false , message:"Entered UserName or UserMail is invalid..!"})
        }
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})
    }
}

export const LogOutUser = async (req , res) => {
    try {
        //API Structure: {}
        //Session Log
        const currentTime = new Date()
        const sessionUpdate = await objUserDb.sessions.update({LoggedOutAt:TimeFormatter(currentTime) , isActive:false} , 
                                                        {where:{userId:req.user.userId}})
        res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
        });
        return res.status(200).json({success:true , message:"User logged out successfully...!"})                                                        
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}
export const UpdateProfile = async (req , res) => {
    //API Structure: {userMail , profilePic , isEmailChange,OTP}
    try {
        //Verify user data
        const {isEmailChange , isProfileChange} = req.body
        let isValidUser
        isValidUser = await objUserDb.users.findOne({where:{userId:req.user.userId}})
        if(!isValidUser){
            return res.status(400).json({success:false , message:"Invalid user ...!"})
        }
        if(isEmailChange){
            const isCorrectOTP = await verifyOTP(req.body.OTP)
            if(! isCorrectOTP.success){
                res.status(400).json({success:false , message:isCorrectOTP.message})
            }
        const updatedEmail = await objUserDb.users.update({userMail:userMail},{where:{userId:req.user.userId}})
        }
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})  
    }
}
export const sendOTP = async(req , res) => {
    try {
        //API Structure: {userMail}
        const {userMail} = req.body
        const otp = await Math.floor(100000 + Math.random() * 900000);
        const userData = await objUserDb.users.findOne({where:{userId:req.user.userId}})
        if(!userData){
            return res.json({success:false , message:"Invalid user ...!"})
        }
        //clear exisiting OTP
        await objUserDb.otps.destroy({where:{userId:userData.userId}})
        const OTPTime = new Date()
        const savedOTP = await objUserDb.otps.create({
            userId:userData.userId,
            OneTimePassword:otp,
            GeneratedTime:TimeFormatter(OTPTime) ,
            WrongAttemptCount:0
        }) 
        //TBD: Send OTP to user's new Mail
        return res.status(200).json({success:true , message:`OTP sent to ${userMail}`})
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})  
    }
}
export const verifyOTP = async (OTP) => {
    //API Structure: {}
    try {
        const currentTime = new Date()
        if(! await objUserDb.users.findOne({where:{userId:req.user.userId}})){
            return {success:false , message:"Invalid user ...!"}
        }
        const OTPData = await objUserDb.otps.findOne({where:{userId:req.user.userId}})
        if(!OTPData){
                return {success:false , message:"No OTP found, Please trigger OTP...!"}
        }
        //isExpired
        const differenceInMinutes = (currentTime - OTPData.GeneratedTime) / (1000 * 60)
        if(differenceInMinutes > 60 || OTPData.WrongAttemptCount >= 3){
            await objUserDb.otps.destroy({where:{userId:req.user.userId}})
            return {success:false , message:"OTP expired please generate new OTP"}
        }
        if(OTPData.OneTimePassword != OTP){
            //increment the wrongAttemptCount
            const newCount = OTPData.WrongAttemptCount += 1
            await objUserDb.otps.update({WrongAttemptCount: newCount} , {where:{userId:OTPData.userId}})
            return {success:false , message:"Incorrect OTP...!"}
        }
        return {success:true}
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message}) 
    }
}
//import models
import bcrypt from 'bcryptjs'
import objUserDb from '../Utils/userDB.js'
import { GenerateJWT } from '../Utils/GenerateJWT.js'
import { TimeFormatter } from '../Utils/timeFormatter.js'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import {ObjUserKafkaProducer} from '../Kafka/Producer/kafkaProducer.js'
dotenv.config();
export const signUpUser = async (req , res) => {
    try {  
        let KafkaMessage = {}
        //regex states : one upper case , one number  , one special character
        const Passwordregex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ , 
              userNameRegex = /^[a-zA-Z0-9]+$/ , 
              EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const isUserDataTaken = await objUserDb.users.findOne({where:{[Op.or]:{userName:req.body.userName , userMail:req.body.userMail}}})
    
        if(typeof req.body.userName !== 'string' || isUserDataTaken){
            return res.status(400).json({success:false , message:'userName or MailId is invalid or already present'})
        }

        if(! userNameRegex.test(req.body.userName) && req.body.userName?.length >= 10){
            return res.status(400).json({success:false , message:"Invalid user name [a-z] & [0-9] are only allowed"})
        }             
        if(! EmailRegex.test(req.body.userMail)){
            return res.status(400).json({success:false , message:"Invalid Email Provided"})
        }
        if((req.body.password.length < 6 && req.body.password.length > 20) || ! Passwordregex.test(req.body.password)){
            return res.status(400).json({success:false , message:'Enter a strong password(One upper case , One Number & One special charcter)'})
        }

        const isDataAtPendingUser = await objUserDb.pendingUsers.findOne({where:{userMail:req.body.userMail}})

        if(isDataAtPendingUser?.isVerified){
            return res.status(400).json({success:false , message:"E-Mail already used"})
        }

        //Hash the password
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password , passwordSalt)
        //TBD: Verify Email with OTP after we can add the user to DB
        
        if(isDataAtPendingUser){
            KafkaMessage.Event = 'ResendVerificationEmail'
            await objUserDb.pendingUsers.destroy({where:{userMail:isDataAtPendingUser.userMail}})
        }
        else{
            KafkaMessage.Event = 'SendVerificationEmail'
        }

        const newPendingUser = await objUserDb.pendingUsers.create({
            userName:req.body.userName.toLowerCase(), 
            password:passwordHash,
            userMail:req.body.userMail, 
            isVerified:false
        })

        const RequestIdentification = process.env.Verification_Key + newPendingUser.reqID
        const RequestIdentificationSalt = await bcrypt.genSalt(5)
        const HashedRequestIdentification =  await bcrypt.hash(RequestIdentification , RequestIdentificationSalt) 

        const [UpdatedPendingUserCount,UpdatedPendingUser] = await objUserDb.pendingUsers.update({verificationHash:HashedRequestIdentification} , {where:{reqID:newPendingUser.reqID} , returning:true})
        
        KafkaMessage.Data = {ReqID:UpdatedPendingUser[0].reqID ,
                            userName:UpdatedPendingUser[0].userName,
                            userMail:UpdatedPendingUser[0].userMail,
                            verificationHash:HashedRequestIdentification
                        }
        const IsEventProduced = ObjUserKafkaProducer.ProduceEvent(KafkaMessage.Event , 'user.create_user.request' , KafkaMessage)

        if(!IsEventProduced){
            return res.status(200).json({success:false , message :`Error sending verification mail to  ${req.body.userMail} , Please retrigger the message`})
        
        }
        return res.status(200).json({success:true , message :`A verification mail has been sent to ${req.body.userMail} ,Please verify to proceed further`})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:"(Server Side)Error while creating a user...!"})
    }
}
export const addUser = async (req , res) => {
    try {
        const {userName , userMail , password} = req.body
        const isUserMailVerified = await objUserDb.pendingUsers.findOne({where:{userMail:userMail}})
        
        if(isUserMailVerified.isVerified){
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password , passwordSalt)

            const newUser = await objUserDb.users.create({
                    organizationId:1, //NewUser
                    userName:userName.toLowerCase(),
                    userMail:userMail,
                    password:passwordHash,
                    profilePic:''
                })
            const JwtToken = GenerateJWT(newUser.userId)
            //Add session Data
            const currentTime = new Date()
            await objUserDb.sessions.create({userId:newUser.userId , loggedInAt:new Date(TimeFormatter(currentTime)) , LoggedOutAt:'' , isActive:true})
            return res.cookie("jwt",
                JwtToken , {
                    maxAge: 60 * 60 * 1000,
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",})
                .status(200)
                .json({success:true , message:'User created successfully'})
        }
        else{
            return res.status(400).json({success:false , message:"Please verify the verification mail sent to the mentioned Email"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:"(Server Side)Error while creating a user...!"})
    }
}
//This handles the mail verification
export const eMailConfirm = async (req , res) => {
    //A email with confirm button will be sent 
    //API Structure: {/user?reqId=12345}
    try { 
        const reqID = req.query?.reqID
        if(!reqID){
            return
        }
        await verifyPendingUser(reqID) 
            .then((verifiedUser) => console.log(`user: ${verifiedUser.userName} && mail: ${verifiedUser.userMail}
                                                verified successfully...!`))
                                    
            .catch(console.log("User Verification failed...!"))        
    } catch (error) {
        console.log(error)
    }
}
export const logInUser = async (req , res) => {
    //API Structure:{userName,userPassword,userMail(optional),closeSession(optional)}
    try {
        const userName = req.body.userName.toString() , userPassword = req.body.password , userMail = req.body?.userMail || '',closeSession = req.body?.closeSession;
        const userCredentials = await objUserDb.users.findOne({where:{[Op.or]:{userName:userName , userMail:userMail}}})
        if(!userCredentials){
            return res.status(400).json({success:false , message:"Invalid userName ....!"})
        }
        const currentTime = new Date()
        const isActiveSession = await objUserDb.sessions.findAll({
                                include:{model:objUserDb.users,
                                where:{[Op.and]:{userName:userName}},
                                attributes:['userName']} , 
                                where:{isActive:true}})
                                
        if(userCredentials.userName || userCredentials.userMail){
            
            //Password Validation
            const isPasswordCorrect = await bcrypt.compare(userPassword , userCredentials.password);
            if(!isPasswordCorrect){
                return res.status(400).json({success:false , message:"Incorrect password for entered UserName...!"})
            }
            //Check for active session
            if(isActiveSession){
                if(closeSession){
                    await objUserDb.sessions.update({isActive:false , LoggedOutAt:currentTime} , {where:{userId:userCredentials.userId}})
                }
                else{
                    //Compare active session in frontend and show close session popup accordingly
                    return res.status(400).json({success:false , message:'ActiveSession'}) //dont change message value
                }
            }
            const JwtToken = await GenerateJWT(userCredentials)
            //TBD:Setup a socket protocol to logout the currrently logged in user
            //Kill the old session if exsits 
            const newSession = await objUserDb.sessions.create({userId:userCredentials.userId , loggedInAt:currentTime , LoggedOutAt:'' , isActive:true})
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
        const sessionUpdate = await objUserDb.sessions.update({LoggedOutAt:currentTime , isActive:false} , 
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
        const isValidUser = await objUserDb.users.findOne({where:{userId:req.user.userId}})
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
//DB call Promises
const verifyPendingUser =  async (reqId) =>{
    return new Promise(async (resolve , reject) => {
        const isUserAvailableAndNotVerified = await objUserDb.pendingUsers.findOne({where:{[Op.or]:{verificationHash:reqId , isVerified:false}}})
        if(isUserAvailableAndNotVerified){
            const verifiedUser = await objUserDb.pendingUsers.update({isVerified:true} , {where:{verificationHash:reqId}})
            resolve(verifiedUser)
        }
        else{
            reject("User verification failed")
        }
    }) 
}

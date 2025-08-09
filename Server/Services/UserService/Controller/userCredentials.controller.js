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
        const isDataAtPendingUser = await objUserDb.pendingUsers.findOne({where:{userMail:req.body.userMail}})

        if(isDataAtPendingUser?.isVerified){
            return res.status(400).json({success:false , message:"E-Mail already used"})
        }
        else if (isDataAtPendingUser?.isVerified === false){
        
            //Re trigger ResendVerificationEmail at KAFKA Notification service 
            KafkaMessage.Event = "ResendVerificationEmail"
            KafkaMessage.Data = {UserMail:isDataAtPendingUser.userMail , UserName:isDataAtPendingUser.userName ,            VerificationHash:isDataAtPendingUser.verificationHash}

            await ObjUserKafkaProducer.ProduceEvent("ResendVerificationEmail" , "user.create_user.request" , KafkaMessage)
            return res.status(200).json({success:true , message:"Verfication email resent ...!"})
        }
        else{
            KafkaMessage.Event = 'SendVerificationEmail'
        }
        //Hash the password
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password , passwordSalt)

        

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
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}
export const addUser = async (req , res) => { 
    try {
        const {userName , userMail , password} = req.body
        
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password , passwordSalt)

            const newUser = await objUserDb.users.create({
                    organizationId:1, //NewUser
                    userName:userName.toLowerCase(),
                    userMail:userMail,
                    password:passwordHash,
                    profilePic:''
                })
            const JwtToken = GenerateJWT(newUser.userId); 

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

    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:"(Server Side)Error while creating a user...!"})
        
    }
}

export const ValidateUser = async (req , res) => {
    if(req.user){

        return res.status(200).json({success:true , message:"Valid user",data:req.user})
    }
    return res.status(400).json({success:false , message:"Invalid user"}) 
}

//This handles the mail verification
export const eMailConfirm = async (req , res) => {
    //A email with confirm button will be sent 
    //API Structure: {/user?reqId=12345}
    try { 
        let KafkaMessage = {}
        KafkaMessage.Event = "UserVerified"
        const reqID = req.query?.reqID
        if(!reqID){
            return
        }
        await verifyPendingUser(reqID) 
            .then(async(UserData) => {
                //Kakfa Event and Add to Users Table
                KafkaMessage.Data = {userMail:UserData.userMail , userName:UserData.userName}
                await ObjUserKafkaProducer.ProduceEvent("UserVerified" , 'user.confirm_user.request' , KafkaMessage)
            })
            .catch(console.log("User Verification failed...!"))        
    } catch (error) {
        await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}

export const GetLoadingTexts = async (req , res) => {
    //API Structure:{}
    try {
        const LoadingTexts = await objUserDb.LoadingTexts.findAll()
        return res.status(200).json({success:true , data:LoadingTexts})
    } catch (error) {
     await objUserDb.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
     return req.status(500).json({success:false , message:error.message})   
    }
}
export const logInUser = async (req , res) => {
    //API Structure:{userName,userPassword,userMail(optional),closeSession(optional)} 
    try {
        const userName = req.body.userName.toString()  , userPassword = req.body.password , userMail = req.body?.userMail || '', closeSession = req.body?.closeSession;
        const userCredentials = await objUserDb.users.findOne({
                                                        include:[{model:objUserDb.organizations , attributes:['organizationId' , 'organizationName']}] , 
                                                        where:{[Op.or]:{userName:userName , userMail:userName}}})
        if(!userCredentials){
            return res.status(400).json({success:false , message:"Invalid userName ....!"})
        }
        const currentTime = new Date()  
                                
        if(userCredentials.userName || userCredentials.userMail){
            
            //Password Validation
            const isPasswordCorrect = await bcrypt.compare(userPassword , userCredentials.password);
            if(!isPasswordCorrect){
                return res.status(400).json({success:false , message:"Incorrect password for entered UserName...!"})
            }
            //Check for active session
            const isActiveSession = await objUserDb.sessions.findAll({
                                include:{model:objUserDb.users,
                                where:{[Op.and]:{userName:userName}},
                                attributes:['userName']} , 
                                where:{isActive:true}})
            if(isActiveSession){
                if(closeSession){
                    await objUserDb.sessions.update({isActive:false , loggedOutAt:currentTime} , {where:{userId:userCredentials.userId}})
                    //TBD:Socket server to manually log out the logged in user
                }
                else{
                    //Compare active session in frontend and show close session popup accordingly
                    return res.status(400).json({success:false , message:'User already logged in , Check Close Session and log in again'}) //dont change message value
                }
            }
            const JwtToken = await GenerateJWT(userCredentials)
            //TBD:Setup a socket protocol to logout the currrently logged in user
            //Kill the old session if exsits 
            const newSession = await objUserDb.sessions.create({userId:userCredentials.userId , loggedInAt:currentTime , LoggedOutAt:'' , isActive:true})
            const userData = {UserID:userCredentials.userId , UserMail:userCredentials.userMail , UserName:userCredentials.userName , OrganizationID:userCredentials.organization.organizationId , OrganizationName:userCredentials.organization.organizationName}
            return res.cookie("jwt",
                JwtToken , {
                    maxAge: 60 * 60 * 1000,
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",})
                .status(200)
                .json({success:true , message:'User logged-IN successfully' , data:userData})
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
        const isUserAvailableAndNotVerified = await objUserDb.pendingUsers.findOne({where:{[Op.and]:{verificationHash:reqId , isVerified:false}}})
        if(isUserAvailableAndNotVerified){
            const verifiedUser = await objUserDb.pendingUsers.update({isVerified:true} , {where:{verificationHash:reqId}})
            resolve(verifiedUser)
        }
        else{
            reject("User verification failed")
        }
    }) 
}

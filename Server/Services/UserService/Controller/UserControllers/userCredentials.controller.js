//import models
import bcrypt from 'bcryptjs'
import objUserDb from '../../Utils/userDB.js'
import { GenerateJWT } from '../../Utils/GenerateJWT.js'
import { TimeFormatter } from '../../Utils/timeFormatter.js'
import dotenv from 'dotenv'
import { Model, Op } from 'sequelize'
import {ObjUserKafkaProducer} from '../../Kafka/Producer/kafkaProducer.js'
import {ProfileActionsServer} from '../../Declarations/PublicEnums.js'
import cloudinary from '../../Lib/Cloudinary.js'
dotenv.config();
export const signUpUser = async (req , res) => {
    try {
        let KafkaMessage = {} 
        let newPendingUser
        const isDataAtPendingUser = await objUserDb.AllModels.pendingUsers.findOne({where:{userMail:req.body.userMail}})

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
            newPendingUser = await objUserDb.AllModels.pendingUsers.create({
                userName:req.body.userName.toLowerCase(), 
                userMail:req.body.userMail, 
                isVerified:false
            })
        }
        

        const RequestIdentification = process.env.Verification_Key + newPendingUser.reqID
        const RequestIdentificationSalt = await bcrypt.genSalt(5)
        const HashedRequestIdentification =  await bcrypt.hash(RequestIdentification , RequestIdentificationSalt) 

        const [UpdatedPendingUserCount,UpdatedPendingUser] = await objUserDb.AllModels.pendingUsers.update({verificationHash:HashedRequestIdentification} , {where:{reqID:newPendingUser.reqID} , returning:true})
        
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
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}
export const addUser = async (req , res) => { 
    try {
        const {userName , userMail , password} = req.body
        
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password , passwordSalt)

            const newUser = await objUserDb.AllModels.users.create({
                    organizationId:1, //NewUser
                    userName:userName.toLowerCase(),
                    userMail:userMail,
                    password:passwordHash,
                    profilePic:''
                })
            const JwtToken = await GenerateJWT(newUser.userId); 

            //Add session Data
            const currentTime = new Date()
            await objUserDb.AllModels.sessions.create({userId:newUser.userId , loggedInAt:Date(TimeFormatter(currentTime)) , LoggedOutAt:'' , isActive:true})
        
            const DataToClient = {UserName: newUser.userName,
                    UserMail: newUser.userMail,
                    UserID: newUser.userId}
            return res.cookie("jwt",
                JwtToken , {
                    maxAge: 60 * 60 * 1000,
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",})
                .status(200)
                .json({success:true , message:'User created successfully' , data:DataToClient});     

    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return res.status(500).json({success:false , message:"(Server Side)Error while creating a user...!"})
        
    }
}

export const ValidateUser = async (req , res) => {
    try {
        if(req.user){
            const UserAndOrgData = await objUserDb.AllModels.users.findOne({ 
                                    where: { userId: req.user.userId },
                                    include: [
                                        {
                                        model: objUserDb.AllModels.organizations,
                                        attributes: ['organizationName', 'organizationId']
                                        }
                                    ]
                                    });
            const RoleData = await objUserDb.AllModels.roles.findOne({where:{userId:req.user.userId}})
            const UserData = {UserName:UserAndOrgData.userName , UserMail:UserAndOrgData.userMail , UserID:UserAndOrgData.userId , ProfilePic:UserAndOrgData.profilePic,OrganizationID:UserAndOrgData.organization.organizationId , OrganizationName:UserAndOrgData.organization.organizationName , Role:RoleData.role}

            return res.status(200).json({success:true , message:"Valid user",data:UserData})
    } 
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false , message:"Invalid user"})  
    }
    
    
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
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}

export const GetLoadingTexts = async (req , res) => {
    //API Structure:{}
    try {
        const LoadingTexts = await objUserDb.AllModels.LoadingTexts.findAll()
        return res.status(200).json({success:true , data:LoadingTexts})
    } catch (error) {
     await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
     return req.status(500).json({success:false , message:error.message})   
    }
}
export const logInUser = async (req , res) => {
    //API Structure:{userName,userPassword,userMail(optional),closeSession(optional)} 
    try {
        const userName = req.body.userName.toString().toLowerCase()  , userPassword = req.body.password , userMail = req.body?.userMail || '';
        let closeSession = true
        const userCredentials = await objUserDb.AllModels.users.findOne({
                                                        include:[{model:objUserDb.AllModels.organizations , attributes:['organizationId' , 'organizationName']}] , 
                                                        where:{[Op.or]:{userName:userName , userMail:userName}}})
        
        const RoleDetails = await objUserDb.AllModels.roles.findOne({where:{userId:userCredentials.userId}});
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
            const isActiveSession = await objUserDb.AllModels.sessions.findAll({
                                include:{model:objUserDb.AllModels.users,
                                where:{[Op.and]:{userName:userName}},
                                attributes:['userName']} , 
                                where:{isActive:true}});
            if(isActiveSession){
                if(closeSession){
                    await objUserDb.AllModels.sessions.update({isActive:false , loggedOutAt:currentTime} , {where:{userId:userCredentials.userId}})
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
            const newSession = await objUserDb.AllModels.sessions.create({userId:userCredentials.userId , loggedInAt:currentTime , LoggedOutAt:'' , isActive:true})
            const userData = {UserID:userCredentials.userId , UserMail:userCredentials.userMail , UserName:userCredentials.userName , OrganizationID:userCredentials.organization.organizationId , OrganizationName:userCredentials.organization.organizationName , ProfilePic:userCredentials.profilePic , Role:RoleDetails?.role || 'NA'};
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
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})
    }
}

export const LogOutUser = async (req , res) => {
    try {
        //API Structure: {}
        //Session Log
        const currentTime = new Date()
        const sessionUpdate = await objUserDb.AllModels.sessions.update({LoggedOutAt:currentTime , isActive:false} , 
                                                        {where:{userId:req.user.userId}})
        
        res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
        });
        return res.status(200).json({success:true , message:"User logged out successfully...!"})                                                        
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})   
    }
}
export const EditProfile = async(req , res) => {
    try {
        //Payload:{Key:TypeofAction , Value:Value}
        const PayloadAsObject = req.body; 
        if(!PayloadAsObject){
            return res.status(400).json({success:false , message:"Missing Param Payload ...!"})
        }
        //Loop and complete action
        let DataToClient = {}
        var Transaction = await objUserDb.userDB.transaction();
        for(let [Action , Value] of Object.entries(PayloadAsObject)){ 
            if(Action == ProfileActionsServer.CHANGE_PROFILE_IMAGE){
                if(Value.length < 1){
                    return res.status(400).json({success:false , message:"Image not uploaded. Try again ...!"})
                }
                let CloudinaryResponse = await cloudinary.uploader.upload(Value)

                //Update in Database
                const NewProfilePic = await objUserDb.AllModels.users.update({profilePic:CloudinaryResponse.secure_url} , {where:{userId:req.user.userId} , returning:true , transaction:Transaction}); 

                DataToClient.ProfilePic = NewProfilePic.profilePic;
            }
            if(Action == ProfileActionsServer.CHANGE_PASSWORD){
                //Validation is done at frontend
                const OldUserData = await objUserDb.AllModels.users.findOne({where:{userId:req.user.userId}});
                const IsPasswordMatch = await bcrypt.compare(Value.NewPassword , OldUserData.password);
                if(!IsPasswordMatch){
                    await objUserDb.AllModels.userErrorLog.create({ErrorDescription:"Old and New password hash does not match" , ClientorServer:'client'});

                    return req.status(400).json({success:false , message:"Old and New password hash does not match"})   
                }
                const PasswordSalt = await bcrypt.genSalt(10)
                const NewPasswordHash = await bcrypt.hash(Value.NewPassword , PasswordSalt)

                await objUserDb.AllModels.users.update({password:NewPasswordHash} , {where:{userId:req.user.userId} , transaction:Transaction})

            }
        }
        await Transaction.commit();
        return res.status(200).json({success:true , message:"Profile updated successfully." , data:DataToClient});
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await Transaction.rollback()
        return req.status(500).json({success:false , message:error.message})   
    }
}
export const UpdateProfile = async (req , res) => {
    //API Structure: {userMail , profilePic , isEmailChange,OTP}
    try {
        //Verify user data
        const {isEmailChange , isProfileChange} = req.body
        const isValidUser = await objUserDb.AllModels.users.findOne({where:{userId:req.user.userId}})
        if(!isValidUser){
            return res.status(400).json({success:false , message:"Invalid user ...!"})
        }
        if(isEmailChange){
            const isCorrectOTP = await verifyOTP(req.body.OTP)
            if(! isCorrectOTP.success){
                res.status(400).json({success:false , message:isCorrectOTP.message})
            }
        const updatedEmail = await objUserDb.AllModels.users.update({userMail:userMail},{where:{userId:req.user.userId}})
        }
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})  
    }
}
export const sendOTP = async(req , res) => {
    try {
        //API Structure: {userMail}
        const {userMail} = req.body
        const otp = await Math.floor(100000 + Math.random() * 900000);
        const userData = await objUserDb.AllModels.users.findOne({where:{userId:req.user.userId}})
        if(!userData){
            return res.json({success:false , message:"Invalid user ...!"})
        }
        //clear exisiting OTP
        await objUserDb.AllModels.otps.destroy({where:{userId:userData.userId}})
        const OTPTime = new Date()
        const savedOTP = await objUserDb.AllModels.otps.create({
            userId:userData.userId,
            OneTimePassword:otp,
            GeneratedTime:TimeFormatter(OTPTime) ,
            WrongAttemptCount:0
        }) 
        //TBD: Send OTP to user's new Mail
        return res.status(200).json({success:true , message:`OTP sent to ${userMail}`})
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message})  
    }
}
export const verifyOTP = async (OTP) => {
    //API Structure: {}
    try {
        const currentTime = new Date()
        if(! await objUserDb.AllModels.users.findOne({where:{userId:req.user.userId}})){
            return {success:false , message:"Invalid user ...!"}
        }
        const OTPData = await objUserDb.AllModels.otps.findOne({where:{userId:req.user.userId}})
        if(!OTPData){
                return {success:false , message:"No OTP found, Please trigger OTP...!"}
        }
        //isExpired
        const differenceInMinutes = (currentTime - OTPData.GeneratedTime) / (1000 * 60)
        if(differenceInMinutes > 60 || OTPData.WrongAttemptCount >= 3){
            await objUserDb.AllModels.otps.destroy({where:{userId:req.user.userId}})
            return {success:false , message:"OTP expired please generate new OTP"}
        }
        if(OTPData.OneTimePassword != OTP){
            //increment the wrongAttemptCount
            const newCount = OTPData.WrongAttemptCount += 1
            await objUserDb.AllModels.otps.update({WrongAttemptCount: newCount} , {where:{userId:OTPData.userId}})
            return {success:false , message:"Incorrect OTP...!"}
        }
        return {success:true}
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        return req.status(500).json({success:false , message:error.message}) 
    }
}
export const LeaveOrg = async (req , res) => {
    try {
        //1. Update userTableID 1
        //2. Remove in Roles Table.
        //0.Declarations
        var Transaction = await objUserDb.userDB.transaction()
        //1.
        const NewOrganization = await objUserDb.AllModels.users.update({organizationId:1} , {where:{userId:req.user.userId} , transaction:Transaction});

        //2.
        await objUserDb.AllModels.roles.destroy({where:{userId:req.user.userId} ,transaction:Transaction});

        //3.
        await Transaction.commit();
        return res.status(200).json({success:true , message:"Successfully left the organization..!" ,data:NewOrganization});
        
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await Transaction.rollback()
        return req.status(500).json({success:false , message:error.message}) 
    }
}
//DB call Promises
const verifyPendingUser =  async (reqId) =>{
    return new Promise(async (resolve , reject) => {
        const isUserAvailableAndNotVerified = await objUserDb.AllModels.pendingUsers.findOne({where:{[Op.and]:{verificationHash:reqId , isVerified:false}}})
        if(isUserAvailableAndNotVerified){
            const verifiedUser = await objUserDb.AllModels.pendingUsers.update({isVerified:true} , {where:{verificationHash:reqId}})
            resolve(verifiedUser)
        }
        else{
            reject("User verification failed")
        }
    }) 
}

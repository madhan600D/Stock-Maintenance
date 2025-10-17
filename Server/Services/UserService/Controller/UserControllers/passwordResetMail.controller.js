//This will send a request to mail service and mail service will send OTP to user
import objUserDb from "../../Utils/userDB.js";
import bcrypt from "bcryptjs";
import { Op } from 'sequelize'
export const sendResetMail = async (req , res) => {
    //Expected API CALL: body:{userName}
    //Generate a OTP and call mail service to send a mail to user
    try {
        //Random return between 0 to 1 in float we round to 6 digits
        
        const otp = await Math.floor(100000 + Math.random() * 900000);
        const userData = await objUserDb.AllModels.users.findOne({where:{userName:req.body.userName.toLowerCase()}})
        if(!userData){
            return res.status(400).json({success:false , message:"invalid user ...!"})
        }
        const userInOtpTable = await objUserDb.AllModels.otps.findOne({Where:{userId:userData.userId}})
        //Clear the Old OTP and add a new one
        if(userInOtpTable){
            await objUserDb.AllModels.otps.destroy({
                where:{userId:req.user.userId}
            })
        }
        const OTPTime = new Date()
        const savedOTP = await objUserDb.AllModels.otps.create({
            userId:userData.userId,
            OneTimePassword:otp,
            GeneratedTime:OTPTime ,
            WrongAttemptCount:0
        }) 
        //TBD:Call the mail service Endpoint and send a Email
        return res.status(200).json({success:true , message: `OTP sent to ${userData.userName}` , mail:userData.userMail})

    } catch (error) {
        return res.status(500).json({success:false , message:`Error while generating OTP :: ErrorDesc: ${error.message}`})
    }
}

export const changerUserPassword = async (req , res) => {
    try {
        //Expected API CALL: body:{userName , OTP , newPassword}
        const {userName , OTP , newPassword} = req.body;
        const currentTime = new Date()
        //OTP validation 
        //Query Join User and OTP
        const OTPData = await objUserDb.AllModels.otps.findOne({
        include: [{
            model: objUserDb.AllModels.users,
            where: { userName: userName.toLowerCase() },  
            attributes: [] // if you don't need user fields
        }]
        });
        const differenceInMinutes = (currentTime - OTPData.GeneratedTime) / (1000 * 60)
        if(differenceInMinutes > 60 || OTPData.WrongAttemptCount >= 3){
            await objUserDb.AllModels.otps.destroy({where:{userId:req.user.userId}})
            return res.status(400).json({success:false , message:"OTP expired please generate new OTP"})
        }
        if(OTPData.OneTimePassword != OTP){
            //increment the wrongAttemptCount
            const newCount = OTPData.WrongAttemptCount += 1
            await objUserDb.AllModels.otps.update({WrongAttemptCount: newCount} , {where:{userId:OTPData.userId}})
            return res.status(400).json({success:false , message:"incorrect OTP"})
        }
        //Hash Password
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(newPassword , passwordSalt)
        await objUserDb.AllModels.users.update({password:passwordHash} , {where:{userName:userName}})
        return res.status(200).json({success:true , message : `User(${userName}) Password resetted successfully`})
    } catch (error) {
        return res.status(500).json({success:false , message:`Error while validating OTP :: ErrorDesc: ${error.message}`})
    }
    
}
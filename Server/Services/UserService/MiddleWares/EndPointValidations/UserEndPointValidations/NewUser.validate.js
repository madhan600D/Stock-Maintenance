
import objUserDb from "../../../Utils/userDB.js"
import {Op} from 'sequelize'
export const signUpUserValidation = async (req , res , next) => {
    try {
        //API Structure: {UserName , UserMail , Password}
        //regex states : one upper case , one number  , one special character
        const Passwordregex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ ,  
              userNameRegex = /^[a-zA-Z0-9]+$/ , 
              EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const IsUserNameAdded = await objUserDb.AllModels.pendingUsers.findOne({where:{userName:req.body.userName}}) 
        const IsUserMailAdded = await objUserDb.AllModels.pendingUsers.findOne({where:{userMail:req.body.userMail}})

        const IsUserNameTaken = await objUserDb.AllModels.users.findOne({where:{userName:req.body.userName}})
        const IsUserMailTaken = await objUserDb.AllModels.users.findOne({where:{userName:req.body.userMail}})
        const IsUserAndMailMatch = await objUserDb.AllModels.pendingUsers.findOne({where:{[Op.and]:{userName:req.body.userName , userMail:req.body.userMail}}})
        if(typeof req.body.userName !== 'string' || IsUserNameTaken){
            return res.status(400).json({success:false , message:'UserName Taken ...!'})
        }
        if(! userNameRegex.test(req.body.userName) && req.body.userName?.length >= 10){
            return res.status(400).json({success:false , message:"Invalid user name [a-z] & [0-9] are only allowed"})
        }             
        if(IsUserMailTaken){
            return res.status(400).json({success:false , message:'UserMail Taken ...!'})
        }
        if(! EmailRegex.test(req.body.userMail)){
            return res.status(400).json({success:false , message:"Invalid Email Provided"})
        }
        if(IsUserNameAdded || IsUserMailAdded){
            if(!IsUserAndMailMatch){
               return res.status(400).json({success:false , message:"Provided User Name doesn't match with Email ...!"}) 
            }
        }
        if((req.body.password.length < 6 && req.body.password.length > 20) || ! Passwordregex.test(req.body.password)){
            return res.status(400).json({success:false , message:'Enter a strong password(One upper case , One Number & One special charcter)'})
        }
        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({success:false , message:'Password and confirm password doesnt match'})
        }
        next() 
    } catch (error) {
        console.log("Error at NewUser Middleware" + error.toString())
        return res.status(500).json({success:false , message:"User validation server side error ...!"})
        
    }
}

export const AddUserValidation = async (req , res , next) => {
    try {
        //Is UserName and UserMail same at PendingUsers Table
        if(req.body.password !== req.body.confirmPassword){ 
            return res.status(400).json({success:false , message:'Password and confirm password doesnt match'})
        }
        //To verify whether user name or user mail taken.

        const {userName , userMail} = req.body ;

        const isUserMailVerified = await objUserDb.AllModels.pendingUsers.findOne({where:{userMail:userMail}})

        if(!isUserMailVerified){
            return res.status(400).json({success:false , message:"Please click on verification button before adding the user ... !"})   
        }
        else{
            if(! isUserMailVerified.isVerified){
                return res.status(400).json({success:false , message:`A verification E-Mail is sent to ${userMail}, Please verify before proceeding. If mail not received, click on the Email button again.`})   
            }
        }
        const IsDataSameInPendingUser = await objUserDb.AllModels.pendingUsers.findOne({where:{[Op.and]:{userName:userName ,       userMail:userMail}}})

        if(!IsDataSameInPendingUser){
            return res.status(400).json({success:false , message:"UserName or MailID doesn't match with the verified UserName ...!"})
        }

        next();

    } catch (error) {
        console.log("Error at NewUser Middleware" + error.toString())
        return res.status(500).json({success:false , message:"User validation server side error ...!"})
    }
}
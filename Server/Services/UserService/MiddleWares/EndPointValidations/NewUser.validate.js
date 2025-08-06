
import objUserDb from "../../Utils/userDB.js"
import {Op} from 'sequelize'
export const signUpUserValidation = async (req , res , next) => {
    try {
        //API Structure: {UserName , UserMail , Password}
        //regex states : one upper case , one number  , one special character
        const Passwordregex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ , 
              userNameRegex = /^[a-zA-Z0-9]+$/ , 
              EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const IsUserNameTaken = await objUserDb.users.findOne({where:{userName:req.body.userName}})
        const IsUserMailTaken = await objUserDb.users.findOne({where:{userName:req.body.userMail}})
    
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
        if((req.body.password.length < 6 && req.body.password.length > 20) || ! Passwordregex.test(req.body.password)){
            return res.status(400).json({success:false , message:'Enter a strong password(One upper case , One Number & One special charcter)'})
        }
        next()
    } catch (error) {
        return res.status(500).json({success:false , message:"User validation server side error ...!"})
        console.log("Error at NewUser Middleware" + error.toString())
    }
}

export const AddUserValidation = async (req , res , next) => {
    try {
        //Is UserName and UserMail same at PendingUsers Table
        const {userName , userMail} = req.body ;

        const isUserMailVerified = await objUserDb.pendingUsers.findOne({where:{userMail:userMail}})

        if(!isUserMailVerified){
            return res.status(400).json({success:false , message:"Please click on verification button before adding the user ... !"})   
        }
        const IsDataSameInPendingUser = await objUserDb.pendingUsers.findOne({where:{[Op.and]:{userName:userName ,       userMail:userMail}}})

        if(!IsDataSameInPendingUser){
            return res.status(400).json({success:false , message:"UserName or MailID doesn't match with the verified UserName ...!"})
        }

        next();

    } catch (error) {
        console.log("Error at NewUser Middleware" + error.toString())
    }
}
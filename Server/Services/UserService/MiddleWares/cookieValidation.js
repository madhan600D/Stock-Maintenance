import jwt from 'jsonwebtoken'
import objUserDb from '../Utils/userDB.js'
export const cookieValidation = async (req , res , next) => {
    try {
        const Token = req.cookies?.jwt
        if(!Token){
                return await res.status(400).json({success:false , message: "Sign IN to access this route ...!"})
            }

            const Verification =  jwt.verify(Token , process.env.JWT_Key)
            if(!Verification){
                return await res.status(400).json({success:false , message: "Unauthorized access"})
            }
            const user = await objUserDb.users.findOne({where:{userId:Verification.userId}})

            if(!user){
                return await res.status(400).json({success:false , message: "Payload user data not found ...!"})
            }
            //Append the user into request and send
            req.user = user
            next()

    } catch (error) {
        return await res.status(400).json({success:false , message: `Error: ${error.message}`}) 
    }
        
}
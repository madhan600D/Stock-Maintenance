import jwt from 'jsonwebtoken'

export const GenerateJWT = async (NewUser) => {
    try {
        const token = jwt.sign({userId:NewUser.userId }, process.env.JWT_Key , {
        expiresIn: '1h'
    })
    return token 
    } catch (error) {
        console.log(error)
    }
    
}
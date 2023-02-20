import { UnAuthenticatedError } from "../errors/index.js"
import jwt from 'jsonwebtoken'

UnAuthenticatedError

const auth = async (req, res, next) => {
    
   const token = req.cookies.token
   if(!token){
    throw new UnAuthenticatedError('Authentication invalid')
}
    
    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId:payload.userId}
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authorization invalid')
    }
   
    
  
}

export default auth
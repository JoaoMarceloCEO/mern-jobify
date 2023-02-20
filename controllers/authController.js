import User from '../models/User.js'
import {StatusCodes} from 'http-status-codes'
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js'
import attachCookie from '../utils/attachCookie.js'

const register = async (req, res, ) => {
    
    const {name, email, password} = req.body
    if(!name || !email || !password){
        throw new BadRequestError('forneça todos os dados')
    }
    const userAlreadyExists =  await User.findOne({email}) //por causa do select:false
    if(userAlreadyExists){
        throw new BadRequestError('Email já foi usado')
    }
    const user = await User.create({name, email, password}) //o select:false não funciona por causa disso
    const token = user.createJWT()
     attachCookie({res, token})

    res.status(StatusCodes.CREATED).json({user: {name: user.name, email: user.email, location: user.location, lastName: user.lastName}, location: user.location})
  
   
  
}

const login = async (req, res) => {
   const {email, password} = req.body
   if(!email || !password){
    throw new BadRequestError('Fornça todos os valores')
   }
   const user = await User.findOne({email}).select('+password')
   if(!user){
    throw new UnAuthenticatedError('Email ou senha incorretos')
   }
   const isPasswordCorrect = await user.comparePassword(password)
   if(!isPasswordCorrect){
    throw new UnAuthenticatedError('Senha incorreta')
   }
   const token = user.createJWT()
   user.password = undefined
attachCookie({res,token})
   
    res.status(StatusCodes.OK).json({user, location:user.location})
}


const updateUser = async (req, res) => {
   const {email, name, lastName, location} = req.body
   if(!email || !name || !lastName || !location){
    throw new BadRequestError('Forneça todos os valores')
   }
   const user = await User.findOne({_id: req.user.userId})
   user.name = name
   user.email = email
   user.lastName = lastName
   user.location = location

   await user.save()

   const token = user.createJWT()
   attachCookie({res,token})
   res.status(StatusCodes.CREATED).json({user, location: user.location})
  
}

const getCurrentUser = async (req,res)=>{
    const user = await User.findOne({_id:req.user.userId})
    res.status(StatusCodes.CREATED).json({user, location: user.location})
}

const logout = async (req, res) =>{
    res.cookie('token', 'logout',{
       httpOnly:true,
       expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:'user logout'})
}

export {register, login, updateUser, getCurrentUser, logout}

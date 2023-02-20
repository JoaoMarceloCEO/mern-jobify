import {UnAuthenticatedError} from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId)=>{ //nesse caso, resource é o job
    
    //if(requestUser === 'admin') return
    if(requestUser.userId === resourceUserId.toString()) return
    throw new UnAuthenticatedError('Not Authorized to access this route') //está retornando erro 500 inves de 401
   
}

export default checkPermissions
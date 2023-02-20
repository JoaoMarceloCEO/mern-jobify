import express from 'express'

const router = express.Router()

import {register, login, updateUser, getCurrentUser, logout} from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'

import rateLimiter from 'express-rate-limit'

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutos
    max: 10, // fazer 10 requests em 15 min por ip
    message: 'Too many requests from this IP address, Please try again after 15 minutes'
})

router.route('/register').post(apiLimiter,register)
router.route('/login').post(apiLimiter,login)
router.route('/logout').get(logout)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser)

export default router


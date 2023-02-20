import express from 'express'
const app  = express()

import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

import {dirname} from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

//security packages
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'

//db and authenticateUser
import connectDB from './db/connect.js'

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'
import authenticateUser from './middleware/auth.js'

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname,'./client/build')))

app.use(express.json()) //torna json disponível por causa dos métodos post
app.use(cookieParser())
app.use(helmet()) //secure the headers
app.use(xss()) //sanitize user inputs - cross site script attacks
app.use(mongoSanitize()) // prevents mongo db operator injection



app.get('/', (req, res) => {
   
    res.send('Oi')
})

app.get('/api/v1', (req, res) => {
   
    res.json({msg:'API'})
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server na porta ${port}`)
        })
    }catch(error){
console.log(error)
    }
}

start()
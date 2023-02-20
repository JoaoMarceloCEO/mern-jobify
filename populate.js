import {readFile} from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js'
import Job from './models/Job.js'

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        await Job.deleteMany() //remove todos os elementos do db
        const jsonProducts = JSON.parse(await readFile(new URL('./MOCK_DATA.json',import.meta.url))) //tudo isso por estart usando ES6 modules invés de common js
        await Job.create(jsonProducts)
        console.log('Success!')
    } catch (error) {
        console.log(error)
    }
}

start()
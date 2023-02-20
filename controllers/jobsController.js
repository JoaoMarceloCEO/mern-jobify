import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js'
import checkPermissions from "../utils/checkPermissions.js"
import moment from 'moment'
import mongoose from "mongoose"

const createJob = async (req,res) => {
   const {position,company} = req.body
if(!position || !company){
    throw new BadRequestError('Please provide all values')
}
  req.body.createdBy = req.user.userId
const job = await Job.create(req.body)


res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req,res) => {
    const {id: jobId} = req.params
    const job = await Job.findOne({_id:jobId})
    if(!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    checkPermissions(req.user, job.createdBy)
    await job.remove()
    res.status(StatusCodes.OK).json({msg:'Job deleted'})
}


const updateJob = async (req,res) => {
   const {id: jobId} = req.params
   const {company, position} = req.body

   if(!position || !company){
    throw new BadRequestError('Please provide all values')
   }

   const job = await Job.findOne({_id: jobId}) //poderia adicionar o userId tbm p/ evitar que outros users modifiquem os jobs. Mas isso inclui tbm o admnin, então não serve

   if(!job){
    throw new NotFoundError(`No job with id: ${jobId}`)
   }

   //check permissions => não queremos q um user com a id de outro user seja capaz de alterar os jobs (o admin pode)

   checkPermissions(req.user, job.createdBy ) //passo o usuário interiro invés da id só, pois verifico se ele é admin ou não

   const updatedJob = await Job.findOneAndUpdate({_id:jobId}, req.body, { //FindOneAndUpdate não ativa um eventual hook que esteja na databse, então usar save()
    new:true,
    runValidators:true
   })

   res.status(StatusCodes.OK).json({updatedJob})
}


const getAllJobs = async (req,res) => {
    
    const {status, jobType, sort, search} = req.query

    const queryObject = {
        createdBy:req.user.userId
    }

    if(status && status !=='all'){
        queryObject.status = status
    }
    if(jobType && jobType !=='all'){
        queryObject.jobType = jobType
    }
    if(search){
        const regex = new RegExp(`^${search}`, 'i');
        queryObject.position = {$regex: regex};
         //case insentive
    }

    //sem await pois quero receber a query
    let result = Job.find(queryObject)

     if(sort === 'latest'){
        result = result.sort('-createdAt')
     }
     if(sort === 'oldest'){
        result = result.sort('createdAt')
     }
     if(sort === 'a-z'){
        result = result.sort('position')
     }
     if(sort === 'z-a'){
        result = result.sort('-position')
     }
     
     //pagination -> 10 jobs por página no máximo
     const page = Number(req.query.page) || 1
     const limit = Number(req.query.limit) || 10
     const skip = (page-1) * limit

     result = result.skip(skip).limit(limit)
    
     const jobs = await result

     const totalJobs = await Job.countDocuments(queryObject)
     const numOfPages = Math.ceil(totalJobs/limit)

    res.status(StatusCodes.OK).json({jobs, totalJobs, numOfPages})
}

const showStats= async (req,res) => {
    let stats = await Job.aggregate([
        {$match: {createdBy:mongoose.Types.ObjectId(req.user.userId)}}, //pegue todos os jobs criados por um user
        {$group: {_id:'$status', count:{$sum:1}}}
    ]) 
    stats = stats.reduce((acc, curr) =>{
        const {_id:title, count} = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }
    let monthlyApplications = await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{
            _id:{year:{$year:'$createdAt'}, month:{$month:'$createdAt'}},count:{$sum:1}}
            },
        {$sort: {'_id.year':-1, '_id.month':-1}},
        {$limit:6},
    ])

    monthlyApplications = monthlyApplications.map((item)=>{
        const {_id:{year, month}, count} = item
        const date = moment().month(month-1).year(year).format('MMM Y')

        return {date, count}
    }).reverse()
    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})
}


export {createJob, deleteJob, getAllJobs, updateJob, showStats}
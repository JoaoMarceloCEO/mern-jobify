import React from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {FaLocationArrow, FaBriefcase, FaCalendarAlt} from 'react-icons/fa'
import { useAppContext } from '../context/appContext'
import JobInfo from './JobInfo'
import Wrapper from '../assets/wrappers/Job'

const Jobs = ({_id, position, jobLocation, jobType, status, company, createdAt}) => {
  const {setEditJob, deleteJob} = useAppContext()
  let date = moment(createdAt)
  date= date.format('MMM Do, YYYY')
  
  return (
   <Wrapper>
    <header>
    <div className="main-icon">{company.charAt(0)}</div>
    <div className="info">
      <h5>{position}</h5>
      <p>{company}</p>
    </div>
    </header>
    <div className="content">
      <div className="content-center">
        <JobInfo icon={<FaLocationArrow/>} text={jobLocation}/>
        <JobInfo icon={<FaCalendarAlt/>} text={date}/>
        <JobInfo icon={<FaBriefcase/>} text={jobType}/>
        <div className={`status ${status}`}>{status}</div>
      </div>
      <footer>
        <div className="actions">

          <Link className= 'btn edit-btn' to='/add-job' onClick={()=>setEditJob(_id)}>
            Edit
          </Link>

          <button type='button'className="btn delete-btn" onClick={()=>deleteJob(_id)}>delete</button>

        </div>
      </footer>
    </div>
   </Wrapper>
  )
}

export default Jobs

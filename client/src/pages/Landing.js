import React from 'react'

import main from '../assets/images/main.svg'
import Wrapper from "../assets/wrappers/LandingPage"
import {Logo} from "../components"
import { Link} from 'react-router-dom'


const Landing = () => {
  return (
   <Wrapper>
    <main>
      <nav>
       <Logo/>
      </nav>
      <div className="container page">
        <div className="info">
        <h1>job <span>tracking</span>app</h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet eius facilis modi hic, nostrum beatae nesciunt temporibus a nemo et consectetur, officia non dolorum odit corporis iure molestias adipisci. Maiores?</p>
        <Link to='/register' className="btn btn-hero">Login/Register</Link>
        </div>
        <img src={main} alt="" className='img main-img'/>
      </div>
    </main>
    </Wrapper>
  
  )
}

export default Landing;
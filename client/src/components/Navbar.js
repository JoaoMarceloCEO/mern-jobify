import React from 'react'
import Wrapper from '.././assets/wrappers/Navbar'
import {FaAlignLeft, FaUserCircle, FaCaretDown} from 'react-icons/fa'
import {useAppContext} from '../context/appContext'
import {useState} from 'react'
import Logo from './Logo'

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false)
  const {toggleSidebar, logoutUser, user} = useAppContext()
  return (
  <Wrapper>
  
  <div className="nav-center">

<button className="toggle-btn" type="button" onClick = {toggleSidebar}>
       <FaAlignLeft/>
</button>
<div>
  <Logo/>
  <h3 className='logo-text'>dashboard</h3>
</div>
<div className="btn-container">
  <button className="btn" type="button" onClick={() =>setShowLogout(!showLogout)}>
<FaUserCircle/>
{user && user.name}
<FaCaretDown/>  
  </button>
  <div className= {showLogout? 'dropdown show-dropdown': 'dropdown'}>
    <button className="dropdown-btn" type="button" onClick={logoutUser}>
      logout
    </button>
  </div>
</div>

  </div>
    
  </Wrapper>
  )
}

export default Navbar

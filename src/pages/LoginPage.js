import React, { useState } from 'react'
import LoginForm from '../modules/LoginForm'
import '../css/login.css';

export default function LoginPage() {
    // state for registration page pop up modal.
    const [shouldRegister,setShouldRegister] = useState(false);

    return (
    <div className='login-background'>
      <div className='login-section'>
        <h3>Tear N' Share</h3>
        <LoginForm/>
        <button onClick={()=>{setShouldRegister(true)}}>Register</button>
      </div>
    </div>
  )
}

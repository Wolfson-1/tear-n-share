import React, { useState } from 'react';
import LoginForm from '../modules/login/LoginForm';
import UserRegistration from '../modules/login/UserRegistration';
import '../css/login.css';

export default function LoginPage({setUser}) {
    // state for registration pop up modal.
    const [shouldRegister,setShouldRegister] = useState(false);

    return (
    <div className='login-background'>
      <div className='login-section'>
        <h3>Tear N' Share</h3>
        <LoginForm/>
        <button onClick={()=>{setShouldRegister(true)}}>Register</button>
        {shouldRegister && <UserRegistration setShouldRegister={setShouldRegister} setUser={setUser}/>}
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import LoginForm from '../modules/login/LoginForm';
import UserRegistration from '../modules/login/UserRegistration';
import '../css/login.css';

export default function LoginPage({setUser}) {
    // state for registration pop up modal.
    const [shouldRegister,setShouldRegister] = useState(false);

    return (
    <div className='login-background'>
      <header className='login-section'>
        <h1>Tear N' Share</h1>
        <LoginForm/>
      </header>
      <main className='login-page-reg-container'>
        <button onClick={()=>{setShouldRegister(true)}}>Register</button>      
      </main>
      <footer>
        <h3>© 2025 Wolfson-1</h3>
      </footer>
      {shouldRegister && <UserRegistration setShouldRegister={setShouldRegister} setUser={setUser}/>}
    </div>
  )
}
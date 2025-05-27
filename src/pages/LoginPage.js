import React, { useState } from 'react';
import LoginForm from '../modules/login/LoginForm';
import UserRegistration from '../modules/login/UserRegistration';
import '../css/login.css';

export default function LoginPage({setUser}) {
    // state for registration pop up modal.
    const [shouldRegister,setShouldRegister] = useState(false);
    //error state 
    const [loginError,setLoginError] = useState(false);

    return (
    <div className='login-background'>
      <header className='login-section'>
        <h1>Tear N' Share</h1>
        <LoginForm loginError={loginError} setLoginError={setLoginError}/>
      </header>
      <main>
        <div className='login-info'>
          <h2>Tear N' Share! - Only pay for the bread you need</h2>
          <p>Share the cost of breads, pastries & baked goods with your community to pay for only what you need & save more</p>
          <div className='reg-container'>
            <p>Don't have an account? Register below!</p>
            <button onClick={()=>{setShouldRegister(true)}}>Register</button>
            {loginError && <p>{loginError}</p>}
          </div>
        </div>
      </main>
      <footer>
        <h3>© 2025 Wolfson-1</h3>
      </footer>
      {shouldRegister && <UserRegistration setShouldRegister={setShouldRegister} setUser={setUser}/>}
    </div>
  )
}
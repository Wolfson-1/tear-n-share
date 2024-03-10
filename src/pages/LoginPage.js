import React, { useState } from 'react'
import LoginForm from '../modules/LoginForm'

export default function Login() {
    // state for registration page pop up modal.
    const [shouldRegister,setShouldRegister] = useState(false);

    return (
    <div>
      <h3>Tear N' Share</h3>
      <LoginForm/>
      <button onClick={()=>{setShouldRegister(true)}}>Register</button>
    </div>
  )
}

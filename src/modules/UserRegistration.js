import React, { useState } from 'react'

export default function UserRegistration({setShouldRegister}) {
    //state for registration input fields
    const [user,setUser] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [confPassword, setConfPassword] = useState(null);
    const [submitError,setSubmitError] = useState(null);
  
    // Clear error if present for on click of input field
    const clearError = () => {
        if (submitError) setSubmitError(null);
    };

    return (
    <div className='user-reg-background'>
     <div className='user-reg-modal'>
        <button onClick={()=>{setShouldRegister(false)}}>close</button>
        <h2>Please Register</h2> 
        <form>
        <label>
            User Name    
            <input type='text' id='user' name='user' placeholder='eg: Ilovebread123' value={user} onClick={clearError} onChange={(e)=>{setUser(e.target.value)}}></input>
        </label>
        <label>
            Email    
            <input type='email' id='email' name='email' placeholder='example@gmail.com' value={email} onClick={clearError} onChange={(e)=>{setEmail(e.target.value)}}></input>
        </label>
        <label>
            Password
            <input type='password' id='password' name='password' placeholder='enter password' value={password} onClick={clearError} onChange={(e)=>{setPassword(e.target.value)}}></input>
        </label>
        <label>
            confirm Password
            <input type='password' id='confPassword' name='confPassword' placeholder='confirm password' value={confPassword} onClick={clearError} onChange={(e)=>{setConfPassword(e.target.value)}}></input>
        </label>      
        </form>
     </div>
    </div>
  )
}

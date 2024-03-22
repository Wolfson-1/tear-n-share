import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function UserRegistration({setShouldRegister,setRegisterThanks}) {
    //state for registration input fields
    const [userName,setUserName] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [confPassword, setConfPassword] = useState(null);
    //state for error handling
    const [regFieldError,setRegFieldError] = useState(null);
    
    // Clear error if present for on click of input field
    const clearError = () => {
        if (regFieldError) setRegFieldError(null);
    };

    const handleForm = async (event) => {
        event.preventDefault();

        if(email === null || password === null || userName === null) {
            setRegFieldError('Please enter both email & password to login.');
            return;
        };

        if(password !== confPassword) {
            setRegFieldError('Passwords not matching. Please enter again.');
            return;
        }
        
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
            updateProfile(user, {
                displayName: userName,
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode}: ${errorMessage}`);
            setRegFieldError('Error in registering account. Email may already be in use.');
            return;
        });

  };
    return (
    <div className='modal-background'>
     <div className='user-reg-modal'>
        <button onClick={()=>{setShouldRegister(false)}}>close</button>
        <h2>Please Register</h2> 
        <form>
        <label>
            User Name    
            <input type='text' id='user' name='user' placeholder='eg: Ilovebread123' value={userName} onClick={clearError} onChange={(e)=>{setUserName(e.target.value)}}></input>
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
        <input type='submit' value={`Register & Login`} onClick={handleForm}></input>      
        </form>
        {regFieldError && <p>{regFieldError}</p>}
     </div>
    </div>
  )
};

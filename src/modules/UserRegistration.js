import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import formUploadCheck from '../utils/formUploadCheck';

export default function UserRegistration({setShouldRegister, setUser}) {
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
        
        //check for blank fields before auth reg attempt 
        const regData = formUploadCheck(event.target.form);

        //if fields blank, set error.
        if(regData.errorVal) {
            setRegFieldError(regData.errorVal);
            return;
        }

        //check if passwords match
        if(password !== confPassword) {
            setRegFieldError('Passwords not matching. Please enter again.');
            return;
        };
        
        // register new user
        const auth = getAuth();
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            // Signed up 
            const user = getAuth().currentUser;
            // add display name to user.
            await updateProfile(user, {
                displayName: userName,
            });
            //setUser details manually for first render
            setUser({loggedIn:true, email:email, displayName:userName});
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode}: ${errorMessage}`);
            setRegFieldError('Error in registering account. Email may already be in use.');
            return;
        }
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


//click register & new user created & logged in 
// user display name updated.

import React, {useState} from 'react'
import {auth} from '../../firebase/config';
import {signInWithEmailAndPassword} from 'firebase/auth';

export default function LoginForm({loginError,setLoginError}) {

  //state for login user values & error
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  // Clear error if present for on click of input field
    const clearError = () => {
      if (loginError) setLoginError(null);
    };

  //submit user data function
  const submitForm = (event) => {
    event.preventDefault();

    if(email === '' || password === '') {
      setLoginError('Please enter both email & password to login.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      setLoginError("email or password incorrect, please try logging in again.");
    })
};

  return (
    <form>
        <label>
            Email    
            <input type='email' id='email' name='email' placeholder='example@gmail.com' value={email} onClick={clearError} onChange={(e)=>{setEmail(e.target.value)}}></input>
        </label>
        <label>
            Password
            <input type='password' id='password' name='password' placeholder='enter password' value={password} onClick={clearError} onChange={(e)=>{setPassword(e.target.value)}}></input>
        </label>
        <input type='submit' value='login' onClick={submitForm}></input>
    </form>
  )
};

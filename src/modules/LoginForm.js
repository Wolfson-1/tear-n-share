import React, {useState } from 'react'
import {auth} from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginForm() {

  //state for login user values & error
  const [email,setEmail] = useState(null);
  const [password,setPassword] = useState(null);
  const [loginError,setLoginError] = useState(null);

  //submit user data function
  const submitForm = (event) => {
    event.preventDefault();

    if(email === null || password === null) {
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
      setEmail(null);
      setPassword(null);
    })
};

  return (
    <form>
        <label>
            Email    
            <input type='email' id='email' name='email' placeholder='example@gmail.com' value={email} onClick={() => {setLoginError(null)}} onChange={(e)=>{setEmail(e.target.value)}}></input>
        </label>
        <label>
            Password
            <input type='password' id='password' name='password' placeholder='enter password' value={password} onClick={() => {setLoginError(null)}} onChange={(e)=>{setPassword(e.target.value)}}></input>
        </label>
        <input type='submit' value='login' onClick={submitForm}></input>
        {loginError && <p>{loginError}</p>}
    </form>
  )
};

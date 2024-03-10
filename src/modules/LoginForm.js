import React, { useEffect } from 'react'
import {db} from '../firebase/config';
import useFetchDoc from '../hooks/useFetchDoc';

export default function LoginForm() {

  //   firebase data test fetch 
  // const testData = useFetchDoc(db,['test','eB6OR2AIVvIZlrAUqPOL']);

  //submit form function
  const submitForm = (event) => {
    event.preventDefault();
    };

  return (
  <div>
    <form>
        <label>
            Email    
            <input type='text' id='email' name='email'></input>
        </label>
        <label>
            Password
            <input type='password' id='password' name='password'></input>
        </label>
        <input type='submit' value='login' onClick={submitForm}></input>
    </form>
  </div>
  )
};

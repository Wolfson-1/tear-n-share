import React from 'react'
import {ContextUser} from '../context/ContextUser';
import { useContext } from 'react';
import userSignOut from '../utils/userSignOut';

export default function Home() {

    //access user status from context
    const user = useContext(ContextUser);

    console.log(user.email);

    return (
    <div>
      <p>welcome {user.email}</p>
      <button className='logout' onClick={()=> {userSignOut()}}>logout</button>
    </div>
  )
}

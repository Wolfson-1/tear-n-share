import React from 'react';
import { useContext } from 'react';
import {ContextUser} from '../context/ContextUser'

export default function UserWelcome({setIsFirstLogin}) {

    //access user from context
    const user = useContext(ContextUser);

    
  return (
    <div className='modal-background'>
      <div className='user-reg-modal thanks'>
        <p>Welcome {user.displayName}. Get ready to get your bread on!</p>
        <button onClick={()=>{setIsFirstLogin('false')}}>Proceed</button>
      </div>
    </div>
    
  )
}

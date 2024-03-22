import React, { useState } from 'react'
import {ContextUser} from '../context/ContextUser';
import { useContext } from 'react';
import UserWelcome from '../modules/UserWelcome';
import userSignOut from '../utils/userSignOut';

export default function Home() {

    //access user status from context
    const user = useContext(ContextUser);

    // state for Welcome modal
    const [welcomeModal, setWelcomeModal] = useState(true);

    console.log(user.uid);

    return (
    <div>
      <p>welcome {user.displayName}</p>
      <button className='logout' onClick={userSignOut}>logout</button>
      {welcomeModal && <UserWelcome setWelcomeModal={setWelcomeModal}/>}
    </div>
  )
}

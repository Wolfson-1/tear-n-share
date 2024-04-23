import React, {useContext} from 'react'
import {ContextUser} from '../../context/ContextUser';
import userSignOut from '../../utils/userSignOut';

export default function MyAccountMain({setMyAccount}) {
  //access user status from context
  const user = useContext(ContextUser);

  return (
    <div className='my-account-main'>
      <button onClick={() => {setMyAccount(false)}}>x</button>
      <div className='profile-details'>
        <p>{user.displayName}</p>
        <img alt='user-profile-image'></img>
      </div>
      <button>Profile Settings</button>
      <div className='showing-switch'>
        <label class="switch">
          Show?
          <input type="checkbox"/>
          <span class="slider round"></span>
      </label>
      </div>
      <div className='range-slider'>
        <label>
          Distance
          <input type="range" min="1" max="100" value="50"/>
        </label>
      </div>
      <button className='user-signout' onClick={userSignOut}>logout</button>
    </div>
  )
}
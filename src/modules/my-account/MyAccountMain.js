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
      <div>
        <p>Lookin for bread</p>
        <button type='slider'></button>  
      </div>
      <div className='range-slider'>
        <p>Distance</p>
        <button>Slider</button>
      </div>
      <button className='user-signout' onClick={userSignOut}>logout</button>
    </div>
  )
}
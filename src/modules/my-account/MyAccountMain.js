import React, {useContext, useEffect, useState} from 'react'
import {ContextUser} from '../../context/ContextUser';
import { db } from '../../firebase/config';
import useFetchDoc from '../../hooks/useFetchDoc';
import userSignOut from '../../utils/userSignOut';

export default function MyAccountMain({setMyAccount, setUpdateData,userData}) {
  //access user status from context
  const user = useContext(ContextUser);

  /* main account state 
  ------------------------- */

  //state values for user distance & show/dont show prefernces
  const [distance,setDistance] = useState(0);
  const [show,setShow] = useState(true);

  /*useEffects
  -------------------------*/
  // set initial user values once userData has loaded if needed
  useEffect(() => {
    //if there is no value for show set show to true 
    if(userData && userData.show === undefined) setUpdateData({show: true});

    //if user data exists set distance values for DOM loading or set to 0
    if(userData) {
      setDistance(userData.distance)
      setShow(userData.show);
    };
  }, [userData])

  return (
    
    <div className='my-account-main'>
     {userData && <>
      <button onClick={() => {setMyAccount(false)}}>x</button>
      <div className='profile-details'>
        <p>{user.displayName}</p>
        <img alt='user-profile-image'></img>
      </div>
      <button>Profile Settings</button>
      <div className='showing-switch'>
      <label class="switch">
          Show?
          <input type="checkbox" checked={show && show} onChange={(e) => {
                                                                  setUpdateData({show: e.target.checked})
                                                                  setShow(userData.show)
                                                                  }}/>
          <span class="slider round"></span>
      </label>
      </div>
      <div className='range-slider'>
        <label>
        Distance
        <input type="range" step='1' min="0" max="50" value={distance && distance} id='dist' list='distVals' onChange={(e) => {
                                                                                                    setUpdateData({distance: +e.target.value})
                                                                                                    setDistance(userData.distance)
                                                                                                    }}/>
        <datalist id="distVals">
            <option value="0" label='0'></option>
            <option value="10" label='10m'></option>
            <option value="20" label='20m'></option>
            <option value="30" label='30m'></option>
            <option value="40" label='40m'></option>
            <option value="50" label='50m'></option>
        </datalist>
        <span>{distance} Miles</span>
    </label>
      </div>
      <button className='user-signout' onClick={userSignOut}>logout</button>
      </>}
    </div>
  )
}
import React, {useContext, useEffect, useState} from 'react';
import '../../css/accountstylesheet.css';
import { ContextUser } from '../../context/ContextUser';
import userSignOut from '../../utils/userSignOut';
import AccountSettingsModal from './AccountSettingsModal';

export default function MyAccountMain({ setMyAccount, setUpdateData, userData, advertCount }) {
  //access user status from context
  const user = useContext(ContextUser);

  /* State
  ------------------------- */

  //state values for user distance & show/dont show prefernces
  const [distance,setDistance] = useState(0);
  const [show,setShow] = useState(true);
  //state for account settings modal
  const [settings,setSettings] = useState(false);
  //state to update users display name

  /* useEffects
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
  }, [userData]);

  useEffect(()=>{
    console.log(advertCount);
  },[advertCount])

  return (
    
    <div className='my-account-main'>
     {userData && <>
      <button className='account-close' onClick={() => {setMyAccount(false)}}>{'<'}</button>
      <div className='profile-details'>
        <picture className='profile-img'>
          <img src={'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png'} alt='acc-img'></img>
        </picture>
        <h2>{user.displayName}</h2>
        <button onClick={()=>{setSettings(true)}}>Profile Settings</button>
      </div>
    <div className='profile-inputs'>
      <div className='show-toggle-container'>
        <h3>show</h3>
        <label class="switch">
                                <input type="checkbox" checked={show && show} onChange={(e) => {
                                                                    setUpdateData({show: e.target.checked})
                                                                    setShow(userData.show)
                                                                    }}/>
                                <span class="slider round"></span>
                        </label>
        {advertCount === 0 && <div className='div-blocker'><p>visibility off due to no current active Ads</p></div>}
      </div>
      <label>
      Distance
      <input type="range" step='0.1' min="0.1" max="50" value={distance && distance} id='dist' list='distVals' onChange={(e) => {
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
        <span>{distance} {userData.distanceUnit}</span>
      </label>
    </div>
      <button className='user-signout' onClick={userSignOut}>logout</button>
      </>}
    {settings && <AccountSettingsModal setSettings={setSettings} userData={userData}/>}
    </div>
  )
}
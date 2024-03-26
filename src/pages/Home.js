import React, { useState, useEffect } from 'react'
import {ContextUser} from '../context/ContextUser';
import { useContext } from 'react';
import MainMap from '../modules/MainMap';
import UserWelcome from '../modules/UserWelcome';
import userSignOut from '../utils/userSignOut';

export default function Home() {

    //access user status from context
    const user = useContext(ContextUser);

    // state for Welcome modal/first login in Local storage
    const [isFirstLogin, setIsFirstLogin] = useState(!localStorage.getItem("firstLogin") ? true : localStorage.getItem("firstLogin"));
    const [firstLoginCheck, setFirstLoginCheck] = useState(null);

    //useEffect for first login local storage change
    useEffect(() => {
        localStorage.setItem('firstLogin', isFirstLogin);
    },[isFirstLogin]);

    //get firstlogin variable to reference for UserWelcome modal on mount & change in welcomeModal
    useEffect(() => {
        const items = localStorage.getItem('firstLogin');
        if (items) {
        setFirstLoginCheck(items);
        }
    }, [isFirstLogin]);

    return (
    <div>
      {firstLoginCheck === 'true' ? <UserWelcome setIsFirstLogin={setIsFirstLogin}/> : null}
      <p>{user.displayName}</p>
      <button className='logout' onClick={userSignOut}>logout</button>
      <main className='main-map-nav-container'>
        <MainMap/>
        <div className='nav-button-container'> 
          <button>Account</button>
          <button>map</button>
          <button>Breat Buds</button>
        </div>
      </main>
    </div>
  )
}

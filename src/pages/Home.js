import React, {useState, useEffect} from 'react'
import MainMap from '../modules/MainMap';
import UserWelcome from '../modules/login/UserWelcome';
import MyAccountMain from '../modules/my-account/MyAccountMain';
import MyBuddiesMain from '../modules/my-buddies/MyBuddiesMain';

export default function Home() {
    // state for Welcome modal/first login in Local storage
    const [isFirstLogin, setIsFirstLogin] = useState(!localStorage.getItem("firstLogin") ? true : localStorage.getItem("firstLogin"));
    const [firstLoginCheck, setFirstLoginCheck] = useState(null);
    // State for main pull out menues for account and buddies
    const [myAccount,setMyAccount] = useState(false);
    const [myBuddies,setMyBuddies] = useState(false);

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
      <main>
        <MainMap/>
        {myAccount && <MyAccountMain setMyAccount={setMyAccount}/>}
        {myBuddies && <MyBuddiesMain setMyBuddies={setMyBuddies}/>}
        <div className='nav-button-container'> 
          <button className='nav-my-account' onClick={() => {setMyAccount(true)}}>Account</button>
          <button className='nav-home'>-</button>
          <button className='nav-my-buddies' onClick={() => {setMyBuddies(true)}}>Breat Buds</button>
        </div>
      </main>
    </div>
  )
}

import React, {useContext, useState, useEffect} from 'react';
import {ContextUser} from '../context/ContextUser';
import { db } from '../firebase/config';
import useUpdateDoc from '../hooks/useUpdateDoc';
import useFetchDoc from '../hooks/useFetchDoc';
import useFetchDocsFilter from '../hooks/useFetchDocsFilter';
import MainMap from '../modules/MainMap';
import UserWelcome from '../modules/login/UserWelcome';
import MyAccountMain from '../modules/my-account/MyAccountMain';
import MyBuddiesMain from '../modules/my-buddies/MyBuddiesMain';

export default function Home() {
  //access user status from context
  const user = useContext(ContextUser);
  
  /*state 
    --------------------*/

    // state for Welcome modal/first login in Local storage
    const [isFirstLogin, setIsFirstLogin] = useState(!localStorage.getItem("firstLogin") ? true : localStorage.getItem("firstLogin"));
    const [firstLoginCheck, setFirstLoginCheck] = useState(null);
    // State for main pull out menues for account and buddies
    const [myAccount,setMyAccount] = useState(false);
    const [myBuddies,setMyBuddies] = useState(false);
    //state for updating user data on change or interation
    const [updateData,setUpdateData] = useState(null);

    /* Hooks
    -------------- */
    //fetch userData-
    const userData = useFetchDoc(db,['userData',user.userUid]);

    //hook to update user data in backend on change
    const updateUserInfo = useUpdateDoc(updateData,db,['userData',user.userUid]);

    // user data for populating users in close proximity
    const visibleUsers = useFetchDocsFilter(db,['userData'],'show',true);

    /* useEffects
    ---------------------- */

    //useEffect for isFirstLogin state changes 
    useEffect(() => {
        //first login local storage change
        localStorage.setItem('firstLogin', isFirstLogin);

        //get firstlogin variable to reference for UserWelcome modal on mount & change in welcomeModal
        const items = localStorage.getItem('firstLogin');
        if (items) {
        setFirstLoginCheck(items);
        }
    },[isFirstLogin]);

      //check for when updateDistance is complete to clear out state for updateFig
      useEffect(() => {
        if(updateUserInfo.isComplete === true) setUpdateData(null);
      },[updateUserInfo.isComplete])

      /*---------------*/

      //selector function for toggling between account & buddy management draw
      const drawToggle = (on,off) => {
        //important: on & off must be useState set functions 
        //set appropriate true & false so both draws aren't open at same time
        on(true)
        off(false)
      };

    return (
    <div>
      {firstLoginCheck === 'true' ? <UserWelcome setIsFirstLogin={setIsFirstLogin}/> : null}
      <main>
        {userData && visibleUsers && <MainMap setUpdateData={setUpdateData} userData={userData} visibleUsers={visibleUsers}/>}
        {myAccount && <MyAccountMain setMyAccount={setMyAccount} setUpdateData={setUpdateData} userData={userData}/>}
        {myBuddies && <MyBuddiesMain setMyBuddies={setMyBuddies}/>}
        <div className='nav-button-container'> 
          <button className='nav-my-account' onClick={() => {drawToggle(setMyAccount,setMyBuddies)}}>Account</button>
          <button className='nav-home'>-</button>
          <button className='nav-my-buddies' onClick={() => {drawToggle(setMyBuddies,setMyAccount)}}>Breat Buds</button>
        </div>
      </main>
    </div>
  )
}

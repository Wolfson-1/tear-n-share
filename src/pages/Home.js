import React, {useContext, useState, useEffect} from 'react';
import {ContextUser} from '../context/ContextUser';
import { ContextNotification } from '../context/ContextNotification';
import { db } from '../firebase/config';
import useUpdateDoc from '../hooks/useUpdateDoc';
import useFetchDoc from '../hooks/useFetchDoc';
import useFetchDocsFilter from '../hooks/useFetchDocsFilter';
import useCollectionCount from '../hooks/useCollectionCount';
import MainMap from '../modules/MainMap';
import UserWelcome from '../modules/login/UserWelcome';
import MapUserInfoModal from '../modules/MapUserInfoModal';
import MyAccountMain from '../modules/my-account/MyAccountMain';
import MyBuddiesMain from '../modules/my-buddies/MyBuddiesMain';
import useAddDoc from '../hooks/useAddDoc';
import NotificationsMain from '../modules/notifications/NotificationsMain';

export default function Home() {
  //access user status from context
  const user = useContext(ContextUser);
  const notificationsUpdate = useContext(ContextNotification);

  /*state 
    --------------------*/

    // state for Welcome modal/first login in Local storage
    const [isFirstLogin, setIsFirstLogin] = useState(!localStorage.getItem("firstLogin") ? true : localStorage.getItem("firstLogin"));
    const [firstLoginCheck, setFirstLoginCheck] = useState(null); 
    // State for main pull out menues for account and buddies
    const [myAccount,setMyAccount] = useState(false);
    const [myBuddies,setMyBuddies] = useState(false);
    //state for creating new & updating user data on change or interation
    const [newUser,setNewUser] = useState(null);
    const [updateData,setUpdateData] = useState(null);
    //state for user in focus for more info modal
    const [userModal,setUserModal] = useState(null);
    //previous advert number state 
    const [prevAdCount,setPrevAdCount] = useState(null);

    /* Hooks
    -------------- */
    //fetch userData
    const userData = useFetchDoc(db,['userData'],user.userUid);

    //update user data in backend on change
    const updateUserInfo = useUpdateDoc(updateData,db,['userData',user.userUid]);

    //add new user doc to database if currently none existent
    const newUserInfo = useAddDoc(newUser,db,['userData'],user.userUid)

    // user data for populating users in close proximity
    const visibleUsers = useFetchDocsFilter(db,['userData'],'show',true);

    //hook to make a new notification on action
    const newNotification = useAddDoc(notificationsUpdate.updateState.updateObj,db,['userData',notificationsUpdate.updateState.sendId,'notificationsReel']);

    //hook to listen to number of adverts user has listed
    const advertCount = useCollectionCount(db,['userData',user.userUid,'adverts'],['active', '==', true]); 

    /* useEffects
    ---------------------- */

    //useEffect for isFirstLogin state changes 
    useEffect(() => {
        //first login local storage change
        localStorage.setItem('firstLogin', isFirstLogin);

        //get firstlogin variable to reference for UserWelcome modal on mount & change in welcomeModal
        const items = localStorage.getItem('firstLogin');
        if (items) {
          //set items exist set login check to it to load first login welcome modal
          setFirstLoginCheck(items);
        }
    },[isFirstLogin]);

    //check for when updateDistance is complete to clear out state for updateFig
    useEffect(() => {
      if(updateUserInfo.isComplete === true) setUpdateData(null);
      if(newUserInfo.isComplete === true) setNewUser(null);
      if(newNotification.isComplete === true) {
        console.log('clearing data')
        notificationsUpdate.updateDispatch({type:'clear-data',payload:null});
      }
    },[updateUserInfo.isComplete,newUserInfo.isComplete,newNotification.isComplete])

    //useEffect to track advert count and set user show status accordingly
    useEffect(()=>{
      //if first render and no prevAdCount exist, set to advert count and return
      if(prevAdCount === null) {
        setPrevAdCount(advertCount);
        return
      };

      //if active advert count === 0 & user show status is true set user show status to false
      if(advertCount === 0 && userData.show === true) setUpdateData({show: false});

      //if advert count goes above 0 and the previous number was 0. set show to true.
      if(advertCount > 0 && prevAdCount === 0) setUpdateData({show: true});

      //once checks are complete set advertCount to prevAdCount
      setPrevAdCount(advertCount);
    },[advertCount]);

      /* Event Handlers
      ------------------*/

      //selector function for toggling between account & buddy management draw
      const drawToggle = (on,off) => {
        //important: on & off must be useState set functions 
        //set appropriate true & false so both draws aren't open at same time
        on(true)
        off(false)
      };

    return (
    <>
      {userData && <div>
        {userModal && <MapUserInfoModal focusProfile={userModal} setFocusProfile={setUserModal}/>}
        {firstLoginCheck === 'true' ? <UserWelcome setIsFirstLogin={setIsFirstLogin}/> : null}
        <main>
          {visibleUsers && <MainMap setUpdateData={setUpdateData} setNewUser={setNewUser} userData={userData} visibleUsers={visibleUsers} setUserModal={setUserModal}/>}
          {myAccount && <MyAccountMain setMyAccount={setMyAccount} setUpdateData={setUpdateData} userData={userData} advertCount={advertCount}/>}
          {myBuddies && <MyBuddiesMain setMyBuddies={setMyBuddies}/>}
          <div className='nav-button-container'> 
            <button className={`nav-my-account ${myAccount ? 'active' : 'inactive'}`} onClick={() => {drawToggle(setMyAccount,setMyBuddies)}}>Account</button>
            <button className={`nav-my-buddies ${myBuddies ? 'active' : 'inactive'}`} onClick={() => {drawToggle(setMyBuddies,setMyAccount)}}>Bread Buds</button>
          </div>
          <NotificationsMain user={user}/>
        </main>
    </div>}
    </>
  )
}

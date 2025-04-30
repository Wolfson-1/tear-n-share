import React, {useEffect, useState} from 'react'
import { db } from '../../firebase/config';
import useFetchDocs from '../../hooks/useFetchDocs';
import NotificationsReel from './NotificationsReel';
import useUpdateDocs from '../../hooks/useUpdateDocs';

export default function NotificationsMain({user}) {

  /* useState
  ----------------- */
  //state for if notificastion section is collapesed or expanded
  const [notificationExpand,setNotificationExpand] = useState(false);
  //state for unread notifications counter
  const [unreadCounter,setUnreadCounter] = useState(0);
  //update docs state
  const [updateIds,setUpdateIds] = useState([]);

  /*Hooks */
  //hook the fetch notifications from backend
  const notifications = useFetchDocs(db,['userData',user.userUid,'notificationsReel'],['createdAt']);
  //hook for updating read status of notifications
  const updateRead = useUpdateDocs({read:true},db,['userData',user.userUid,'notificationsReel'],updateIds);

  /* useEffects */
    useEffect(()=>{
        //run only if notifications exist and notifications tray is collapsed
        if(notifications && !notificationExpand) {;
        //reducer to count out number of notifications are unRead
        const unreadCounter = notifications.reduce((acc,curr)=>{
            if(curr.read === false) acc += 1;
            return acc
        },0);

        // set state for counter if there are unread notifications
        unreadCounter > 0  && setUnreadCounter(unreadCounter);
        //logic to run filter & update of unread notifications to read on expansion of notificaitons seciton
        } else if(notifications && notificationExpand) {
            const unreadIds = notifications.filter(notification => notification.read === false)
            .map(notification => notification.id);

            //set state for unreadIds to be updated to read
            setUpdateIds(unreadIds);
            //reset counter for unread notifications
            setUnreadCounter(0);
        };
    },[notifications,notificationExpand])

    //To run on completion of updating unread notifications to clear previous exisitng Ids
    useEffect(()=>{
        if(updateRead.isComplete) setUpdateIds([]);
    },[updateRead.isComplete])
  
  /* Event Handlers
  ----------------- */
  //event handler to open and close notifications tray on click of expand
  const expandNotifications = ()=> {
    if(notificationExpand === true) setNotificationExpand(false);
    if(notificationExpand === false) setNotificationExpand(true);
  };

  return (
    <>
        <div className={`notifications-container ${notificationExpand ? 'expand' : 'collapse'}`}>
            {!notificationExpand && unreadCounter > 0 && <div className='unread-counter'>{unreadCounter}</div>}
            <button className='expand-button' onClick={expandNotifications}>{notificationExpand === true ? 'collapse' : 'expand'}</button>
            {notificationExpand && notifications && <NotificationsReel notifications={notifications}/>}
            {notificationExpand && !notifications && <p>You currently have no updates</p>}
        </div>
    </>
  )
};

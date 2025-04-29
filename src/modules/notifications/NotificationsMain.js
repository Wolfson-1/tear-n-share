import React, {useState} from 'react'

export default function NotificationsMain() {

  /* useState
  ----------------- */
  //state for if notificastion section is collapesed or expanded
  const [notificationExpand,setNotificationExpand] = useState(false);

  /*eventHandlers
  ----------------- */
  //event handler to open and close notifications tray on click of expand
  const expandNotifications = ()=> {
    if(notificationExpand === true) setNotificationExpand(false);
    if(notificationExpand === false) setNotificationExpand(true);
  }

  return (
    <>
    <div className={`notifications-container ${notificationExpand ? 'expand' : 'collapse'}`}>
        <button className='expand-button' onClick={expandNotifications}>{notificationExpand === true ? 'collapse' : 'expand'}</button>
        {notificationExpand && <div className='notifications-reel'></div>}
    </div>
    </>
  )
}

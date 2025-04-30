import React from 'react'
import NewChatMessage from './notification-tiles/NewChatMessage'

export default function NotificationsReel({notifications}) {

    return (
    <div className='notifications-reel'>
    {notifications.map((notification)=>{ 
        if(notification.type === 'new-chat-message') return <NewChatMessage notification={notification}/>
    })}
    </div>
  )
}

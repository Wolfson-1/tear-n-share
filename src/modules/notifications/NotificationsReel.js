import React from 'react'
import NewChatMessage from './notification-tiles/NewChatMessage'
import AcceptRejectAdRequest from './notification-tiles/AcceptRejectAdRequest'
import ReceivedRequest from './notification-tiles/ReceivedRequest'
import NewBuddyMatch from './notification-tiles/NewBuddyMatch'
import AdEvent from './notification-tiles/AdEvent'
import { epochtoReadable } from '../../utils/timeDateCalcs'

export default function NotificationsReel({notifications}) {

    return (
    <div className='notifications-reel'>
        {notifications.map((notification)=>{ 

            //create time stamp to pass down & use in notification
            const timeStamp = epochtoReadable(notification.dateTime,'short');
            
            switch (notification.type) {
                case 'new-chat-message':
                    return <NewChatMessage notification={notification} timeStamp={timeStamp}/>
                case 'request-response-notification':
                    return <AcceptRejectAdRequest notification ={notification} timeStamp={timeStamp}/>
                case 'new-buddy-match':
                    return <NewBuddyMatch notification={notification} timeStamp={timeStamp}/>
                case 'advert-request-notification':
                    return <ReceivedRequest notification={notification} timeStamp={timeStamp}/>
                case 'advert-event': 
                    return <AdEvent notification={notification} timeStamp={timeStamp}/>
            }
            })
        }
    </div>
  )
}

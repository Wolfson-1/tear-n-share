import React from 'react'

export default function DeleteEvent({notification,timeStamp}) {
 
    switch (notification.deleteType) {
        case 'advert':
            return <div className='info-tile notification'>
                        <span>{timeStamp}</span>
                        <p>{notification.userName} ended an advert with you. You are still matched & can message this user.</p>
                    </div>
        case 'user':
            return <div className='info-tile notification'>
                        <span>{timeStamp}</span>
                        <p>{notification.userName} ended their user agreement with you. You will no longer be able to contact this user.</p>
                    </div>
    }
}

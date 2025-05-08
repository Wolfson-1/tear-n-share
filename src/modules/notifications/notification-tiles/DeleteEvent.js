import React from 'react'

export default function DeleteEvent({notification,timeStamp}) {
 
    switch (notification.deleteType) {
        case 'advert':
            return <div>
                        <p>{notification.userName} ended an advert with you. You are still matched & can message this user.</p>
                        <span>{timeStamp}</span>
                    </div>
        case 'user':
            return <div>
                        <p>{notification.userName} ended their user agreement with you. You will no longer be able to contact this user.</p>
                        <span>{timeStamp}</span>
                    </div>
    }
}

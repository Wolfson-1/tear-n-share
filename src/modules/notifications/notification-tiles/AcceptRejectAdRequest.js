import React from 'react'

export default function AcceptRejectAdRequest({notification,timeStamp}) {
  
  return (
    <div className='info-tile notification'>
     <span>{timeStamp}</span>
     <p>Your request sent to {notification.userName} has been {notification.status}</p>  
    </div>
  )
}

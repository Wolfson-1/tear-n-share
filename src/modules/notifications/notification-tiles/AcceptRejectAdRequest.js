import React from 'react'

export default function AcceptRejectAdRequest({notification,timeStamp}) {
  
  return (
    <div>
     <p>Your request sent to {notification.userName} has been {notification.status}</p>  
     <span>{timeStamp}</span>
    </div>
  )
}

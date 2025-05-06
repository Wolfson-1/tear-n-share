import React from 'react'

export default function ReceivedRequest({notification,timeStamp}) {
  return (
    <div>
        <p>You have a new request for one of your adverts from {notification.userName}</p>
        <span>{timeStamp}</span>
    </div>
  )
}

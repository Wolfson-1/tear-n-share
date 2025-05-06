import React from 'react'

export default function ReceivedRequest({notification,timeStamp}) {
  return (
    <div>
        <p>You have a new request on one of your current adverts from: {notification.userName}</p>
        <span>{timeStamp}</span>
    </div>
  )
}

import React from 'react'

export default function ReceivedRequest({notification,timeStamp}) {
  return (
    <div className='info-tile notification'>
        <span>{timeStamp}</span>
        <p>You have a new request for one of your adverts from {notification.userName}</p>
    </div>
  )
}

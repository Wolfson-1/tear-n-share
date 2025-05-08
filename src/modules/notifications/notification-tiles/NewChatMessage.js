import React from 'react'

export default function NewChatMessage({notification,timeStamp}) {

    return (
    <div className='info-tile notification'>
        <span>{timeStamp}</span>
        <p>You have received a new message from {notification.userName}</p>
    </div>
  )
}
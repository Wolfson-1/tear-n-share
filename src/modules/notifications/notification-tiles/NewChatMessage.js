import React from 'react'

export default function NewChatMessage({notification,timeStamp}) {

    return (
    <div className='info-tile notification'>
        <p>You have received a new message from {notification.userName}</p>
        <span>{timeStamp}</span>
    </div>
  )
}
import React from 'react'

export default function NewChatMessage({notification,timeStamp}) {

    return (
    <div className='info-tile notification' key={notification.id}>
        <span>{timeStamp}</span>
        <p>You have received a new message from {notification.userName}</p>
    </div>
  )
}
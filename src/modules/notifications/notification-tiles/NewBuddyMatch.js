import React from 'react'

export default function NewBuddyMatch({notification,timeStamp}) {
  return (
    <div className='info-tile notification'>
        <span>{timeStamp}</span>
        <p>You have a new Buddy match! {notification.userName}</p>
    </div>
  )
}
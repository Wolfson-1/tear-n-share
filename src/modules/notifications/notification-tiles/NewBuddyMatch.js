import React from 'react'

export default function NewBuddyMatch({notification,timeStamp}) {
  return (
    <div>
        <p>You have a new Buddy match! {notification.userName}</p>
        <span>{timeStamp}</span>
    </div>
  )
}
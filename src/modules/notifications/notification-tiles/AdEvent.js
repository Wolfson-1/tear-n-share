import React from 'react'

export default function AdEvent({notification,timeStamp}) {
  return (
    <div>
      <p>{notification.userName} has created a new {notification.eventType} event for an ad you share.</p>  
      <span>{timeStamp}</span>
    </div>
  )
}

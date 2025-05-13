import React from 'react'

export default function AdEvent({notification,timeStamp}) {
  return (
    <div className='info-tile notification' key={notification.id}>
      <span>{timeStamp}</span>
      <p>{notification.userName} has created a new {notification.eventType} event for an ad you share.</p>  
    </div>
  )
}

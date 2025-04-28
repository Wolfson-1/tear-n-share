import React from 'react'

export default function ChatMessage({user, message,readMessage}) {


  //variable for dateTime
  const dateTime = new Date(message.dateTimeSent);
  const time = dateTime.toTimeString();
  const date = dateTime.toDateString();

  return (
    <div className={user.userUid === message.senderId ? 'chat-message sent' : 'chat-message received'}>
      <p>{time.slice(0,5)}, {date.slice(8,10)} {date.slice(4,7)}, {date.slice(11,15)}</p>
      <div className='info-tile message-text'>
        <p>{message.text}</p>
      </div>
      {readMessage && <p>Read</p>}
    </div>
  )
}

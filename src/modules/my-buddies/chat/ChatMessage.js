import React from 'react'
import { epochtoReadable } from '../../../utils/timeDateCalcs';

export default function ChatMessage({user, message,readMessage}) {

  //use epoch to readable function to convert epoch dateTime to reable for use in DOM
  const dateAndTime = epochtoReadable(message.dateTimeSent,'short');

  return (
    <div className={user.userUid === message.senderId ? 'chat-message sent' : 'chat-message received'} key={message.id}>
      <p>{dateAndTime}</p>
      <div className='info-tile message-text'>
        <p>{message.text}</p>
      </div>
      {readMessage && <p>Read</p>}
    </div>
  )
}

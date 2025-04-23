import React from 'react'

export default function ChatMessage({message}) {
  
  //variable for dateTime 
  const dateTime = new Date(message.dateTimeSent);
  const time = dateTime.toTimeString();
  const date = dateTime.toDateString();

  return (
    <div>
      <p>{message.text}</p>
      <p>{time.slice(0,5)}, {date.slice(0,3)} {date.slice(8,10)} {date.slice(4,7)}, {date.slice(11,15)}</p>
    </div>
  )
}

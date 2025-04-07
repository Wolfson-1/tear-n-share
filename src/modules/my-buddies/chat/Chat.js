import React from 'react'

export default function Chat({currentChat,setCurrentChat}) {
    console.log(currentChat);
 
    return (
    <div>
      <button onClick={()=>{setCurrentChat(null)}}>{`<- Back`}</button>
      <h2>{currentChat.displayName}</h2>
    </div>
  )
}

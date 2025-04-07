import React from 'react'

export default function NewChatModal({activeBuddies,setCurrentChat,setAddChatModal}) {

  // Function for setting current chat id when clicked & closing modal
  const setNewChat = (id) => {
    setCurrentChat(id)
    setAddChatModal(false)
  };

  return (
    <div className='modal-background'>
        <div className='modal-form-container'>
            <button onClick={()=>{setAddChatModal(false)}}>x</button>
            <h2>Start a New Chat</h2>
            <div className='acive-buddy-list'>
                {activeBuddies.map((buddy)=>{
                    return <div className='active-buddy'>
                                <h3>{buddy.displayName}</h3>
                                <button onClick={()=>{setNewChat(buddy)}}>Chat</button>
                           </div>
                })}
            </div>
        </div>
    </div>
  )
}

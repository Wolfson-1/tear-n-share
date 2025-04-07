import React, { useEffect, useState } from 'react'

export default function NewChatModal({sharedUserData,setCurrentChat,setAddChatModal,user}) {

  // Function for setting current chat id when clicked & closing modal
  const setNewChat = (id) => {
    setCurrentChat(id)
    setAddChatModal(false)
  };

  /*useState
  --------------------- */
  const [withoutChat,setWithoutChat] = useState([]);

  /*useEffects
  --------------------- */

  //useEffect to filter out any users that already have a chat
  useEffect(()=>{
    const usersWithoutChat = sharedUserData.filter((user)=>{
        return !user.latestMessageDateTime
    })
    setWithoutChat(usersWithoutChat);
  },[])

  return (
    <div className='modal-background'>
        <div className='modal-form-container'>
            <button onClick={()=>{setAddChatModal(false)}}>x</button>
            <h2>Start a New Chat</h2>
            <div className='acive-buddy-list'>
                {withoutChat.map((data)=>{
                    //pull user & id from chatPreview for display in DOM
                    const chatUser = data.matchedUsers.filter((match)=>{
                        return match.userId !== user.userUid
                    })

                    return <div className='active-buddy'>
                                <h3>{chatUser[0].userName}</h3>
                                <button onClick={()=>{setNewChat(data)}}>Chat</button>
                           </div>
                })}
            </div>
        </div>
    </div>
  )
}

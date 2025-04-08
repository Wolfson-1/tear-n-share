import React,{useState,useEffect} from 'react'

export default function ExistingChatList({sharedUserData,user,setCurrentChat}) {

  console.log(sharedUserData);

    /*useState
  --------------------- */
  const [existingChat,setExistingChat] = useState([]);

  /*useEffects
  --------------------- */

  //useEffect to filter out any users that already have a chat
  useEffect(()=>{
    const usersExistingChat = sharedUserData.filter((item)=>{
        return item.latestMessageDateTime
    })

    setExistingChat(usersExistingChat);
  },[]);

  return (
    <>
    {existingChat && existingChat.length > 0 ? <div className='existing-chats'>  
      {existingChat.map((data)=>{
        //pull user & id from chatPreview for display in DOM
        const chatUser = data.matchedUsers.filter((match)=>{
          return match.userId !== user.userUid
        })

        //covert date for display in DOM
        console.log(existingChat);
        const dateTime = new Date(data.latestMessageDateTime);
        const date = dateTime.toDateString();

        return <div className='chat-preview' onClick={()=>{setCurrentChat(data)}}>
                  <h2>{chatUser[0].userName}</h2>
                  <p>{data.latestMessageUser}: {data.latestMessageText}</p>
                  <p>{date.slice(8,10)} {date.slice(4,7)}</p>
              </div>
      })}
    </div>:<p>No current chats yet!</p>}
    </>
    
  )
}

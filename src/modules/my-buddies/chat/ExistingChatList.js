import React,{useState,useEffect} from 'react'

export default function ExistingChatList({sharedUserData,user,setCurrentChat,setMessageRead}) {
;
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

  /* finctions & handlers
  ----------------------- */
  const messageOnclick = (data) => {
    //set message read object to change status of it message has been read or not. as well as Id to update this in backend.
    setMessageRead({read: {latestMessageRead:true}, id:data.id});
    //set current chat to change to focused chat window
    setCurrentChat(data);
  }

  return (
    <>
    {existingChat && existingChat.length > 0 ? <div className='existing-chats'>  
      {existingChat.map((data)=>{
        //pull user & id from chatPreview for display in DOM
        const chatUser = data.matchedUsers.filter((match)=>{
          return match.userId !== user.userUid
        })

        //covert date for display in DOM
        const dateTime = new Date(data.latestMessageDateTime);
        const date = dateTime.toDateString();

        return <div className='chat-preview' onClick={()=>{messageOnclick(data)}}>
                  <h2>{chatUser[0].userName}</h2>
                  <p>{data.latestMessageUser}: {data.latestMessageText}</p>
                  <p>{date.slice(8,10)} {date.slice(4,7)}</p>
              </div>
      })}
    </div>:<p>No current chats yet!</p>}
    </>
    
  )
}

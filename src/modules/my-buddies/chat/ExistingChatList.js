import React,{useState,useEffect} from 'react';
import NewChatModal from './NewChatModal';

export default function ExistingChatList({user,sharedUserData,setCurrentChat,setMessageRead}) {
;
    /*useState
  --------------------- */
  //existingChat data to populate dom with existing previews to current chats & ability to open them
  const [existingChat,setExistingChat] = useState([]);
  // handling of new/add chat modal is open or not
  const [addChatModal,setAddChatModal] = useState(false);
  //for undread message counter to display unread message number to dom
  const [unreadCounter,setUnreadCounter] = useState(0);

  /*useEffects
  --------------------- */
  //useEffect to filter out any users that already have a chat
  useEffect(()=>{
    if(sharedUserData) {
      const usersExistingChat = sharedUserData.filter((item)=>{
        return item.latestMessageDateTime
    })

    setExistingChat(usersExistingChat);
    }
  },[sharedUserData]);

    //runs on fetch of shared data between logged user & paired matches. Then filteres to count current unread messages
    useEffect(()=>{
      // init counter for tracking unread messages 
      let counter = 0
  
      //return if there is currently no shared user data (not arrived from backend)
      if(!sharedUserData || sharedUserData === null) return;
  
      //for each set of data shared with a matched user check for current message if sent by other user & if currently unread
      sharedUserData.forEach((data)=>{
        //if there is no data linked to messages, return
        if(data.latestMessageRead == null || data.latestMessageRead == undefined) return;
        // increment counter if latest message is unread & it was sent by other user in chat.
        if(data.latestMessageRead === false && data.latestMessageUser !== user.displayName) {
         counter = ++counter;
        }
      })
      //set state for unread counter once check is complete
      setUnreadCounter(counter);
    },[sharedUserData])

  /* finctions & handlers
  ----------------------- */
  const messageOnClick = (data) => {
    //set message read object to change status of it message has been read or not. as well as Id to update this in backend.
    setMessageRead({read: {latestMessageRead:true}, id:data.id});
    //set current chat to change to focused chat window
    setCurrentChat(data);
  }

  return (
    <>
    <h2>Chats</h2>
    {sharedUserData && <h3> Unread Messages: {unreadCounter.toString()}</h3>}
    {existingChat && existingChat.length > 0 ? <div className='existing-chats'>  
      {existingChat.map((data)=>{
        //pull user & id from chatPreview for display in DOM
        const chatUser = data.matchedUsers.filter((match)=>{
          return match.userId !== user.userUid
        })

        //covert date for display in DOM
        const dateTime = new Date(data.latestMessageDateTime);
        const date = dateTime.toDateString();

        return <div className='info-tile chat-preview' onClick={()=>{messageOnClick(data)}}>
                  <h2>{chatUser[0].userName}</h2>
                  <p>{data.latestMessageUser}: {data.latestMessageText}</p>
                  <p>{date.slice(8,10)} {date.slice(4,7)}</p>
              </div>
      })}
    </div>:<p>No current chats yet!</p>}
    {sharedUserData ? 
    <button className='add-button' onClick={()=>{setAddChatModal(true)}}>+</button>:
    <p>match with other users & you will be able to chat with them here!</p>}
    {addChatModal === true && <NewChatModal sharedUserData={sharedUserData} setCurrentChat={setCurrentChat} setAddChatModal={setAddChatModal} user={user}/>}
    </>
    
  )
}

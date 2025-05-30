import React,{useState,useEffect} from 'react';
import NewChatModal from './NewChatModal';

export default function ExistingChatList({user,sharedUserData,setCurrentChat,setMessageRead}) {
;
    /*useState
  --------------------- */
  // handling of new/add chat modal is open or not
  const [addChatModal,setAddChatModal] = useState(false);
  //existingChat data to populate dom with existing previews to current chats & ability to open them
  const [existingChat,setExistingChat] = useState(undefined);
  //for undread message counter to display unread message number to dom
  const [unreadCounter,setUnreadCounter] = useState(0);

  /*useEffect 
  ----------------------*/

       //runs on fetch of shared data between logged user & paired matches. Then filteres to count current unread messages
       useEffect(()=>{
        // init counter for tracking unread messages 
        let counter = 0
        let chatArr = []
    
        //return if there is currently no shared user data (not arrived from backend)
        if(!sharedUserData) {
          return;
        };
    
        //for each set of data shared with a matched user check for current message if sent by other user & if currently unread
        sharedUserData.forEach((data)=>{
          //if there is no data linked to messages, return
          if(!data.latestMessageUser) return;

          //push data to arr for users that have an existing chat
          chatArr = [...chatArr,data];
          
          // increment counter if latest message is unread & it was sent by other user in chat.
          if(data.latestMessageRead === false && data.latestMessageUser !== user.displayName) {
           counter = ++counter;
          }
        })
  
        setExistingChat(chatArr);
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

  useEffect(()=>{
    console.log(sharedUserData)
  },[sharedUserData])

  return (
    <>
      <h2>Chats</h2>
      <h3> Unread Messages: {unreadCounter.toString()}</h3>
      {existingChat && <>
        {existingChat.length === 0 ? 
        <p>No current chats yet!</p> 
        :
        <div className='existing-chats'>  
          {existingChat.map((data)=>{
            //pull user & id from chatPreview for display in DOM
            const chatUser = data.matchedUsers.filter((match)=>{
              return match.userId !== user.userUid
            })

            //covert date for display in DOM
            const dateTime = new Date(data.latestMessageDateTime);
            const date = dateTime.toDateString();

            return <div className='info-tile chat-preview' key={data.id} onClick={()=>{messageOnClick(data)}}>
                      <picture src={'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png'} className='profile-img'>
                        <img src={'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png'} alt={chatUser[0].userName}></img>
                      </picture>
                      <div className='message-info'>
                        <h2>{chatUser[0].userName}</h2>
                        <p>{data.latestMessageUser}: {data.latestMessageText}</p>
                        <span>{date.slice(8,10)} {date.slice(4,7)}</span>
                      </div>
                  </div>
          })}
        </div>}
      </>}
        {sharedUserData !== undefined && 
        <>
          {sharedUserData.length > 0 ? <button className='add-button' onClick={()=>{setAddChatModal(true)}}>+</button>
          : <p>Match with other users & you will be able to chat with them here!</p>}
        </>}
      {addChatModal === true && <NewChatModal sharedUserData={sharedUserData} setCurrentChat={setCurrentChat} setAddChatModal={setAddChatModal} user={user}/>}
    </>
  )
}

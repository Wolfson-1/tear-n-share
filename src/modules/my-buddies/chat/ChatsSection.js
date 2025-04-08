import React, { useContext, useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useFetchDocsFilterIds from '../../../hooks/useFetchDocsFilterIds';
import ExistingChatList from './ExistingChatList';
import NewChatModal from './NewChatModal';
import Chat from './Chat';
import useAddSubDoc from '../../../hooks/useAddSubDoc';
import useUpdateDoc from '../../../hooks/useUpdateDoc';

export default function ChatsSection() {
  // context for user
  const user = useContext(ContextUser);

  /* State
  --------------- */ 
  const [buddyIds,setBuddyIds] = useState([]);

  // state for handling if new/add chat modal is open or not
  const [addChatModal,setAddChatModal] = useState(false);
  //state for opening a chat
  const [currentChat,setCurrentChat] = useState(null);
  //state for undread message counter
  const [unreadCounter,setUnreadCounter] = useState(null);
  // state for updating read status of message
  const [messageRead,setMessageRead] = useState({read:null,messageRead:null});
  
  /* hooks
  --------------- */
  //active buddies data
  const activeBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
  const sharedUserData = useFetchDocsFilterIds(db,['sharedUserData'],buddyIds);
  //update doc hook to change read status of message
  const updateReadMessage = useUpdateDoc(messageRead.read,db,['sharedUserData',messageRead.id]);
  

  /* useEffects
  --------------- */
  //function to run on fetching of user data to count unread messages
  useEffect(()=>{
    // init counter for tracking unread messages 
    let counter = 0

    //return if there is no shared user data yet
    if(!sharedUserData || sharedUserData === null) return;

    sharedUserData.forEach((data)=>{
      //if there is no data linked to messages, return
      if(data.latestMessageRead == null || data.latestMessageRead == undefined);
      // increment counter if latest message is unread & it was sent by other user in chat.
      if(data.latestMessageRead === false && data.latestMessageUser !== user.displayName) {
       counter = ++counter;
      }
    })
    //set state for unread counter
    setUnreadCounter(counter);
  },[sharedUserData])

  //sets buddy ID's for use in fetching filtered data using Id's of matched users from user data in backed
  useEffect(()=>{
    if(activeBuddys) {
    //map Ids from activeBuddy data for filtering out shared user data between buddies for use in chat
    const filteredIds = activeBuddys.map((item)=>{
      return item.id
    })
    // set ids data
    setBuddyIds(filteredIds);
  }
  },[activeBuddys]);

  useEffect(()=>{
    if(updateReadMessage.isComplete === true) setMessageRead({read:null,messageRead:null});
  },[updateReadMessage.isComplete]);

  return (
    <div className='chat-container'>
      {activeBuddys && 
      <>
        {currentChat ? 
          <Chat currentChat={currentChat} setCurrentChat={setCurrentChat}/> : 
        <> 
          <h2>Chats</h2>
          
          {sharedUserData && <>
            {unreadCounter && <h3> Unread Messages: {unreadCounter.toString()}</h3>}
            <ExistingChatList sharedUserData={sharedUserData} user={user} setCurrentChat={setCurrentChat} setMessageRead={setMessageRead}/>
            <button onClick={()=>{setAddChatModal(true)}}>+</button>
            {addChatModal === true && <NewChatModal sharedUserData={sharedUserData} setCurrentChat={setCurrentChat} setAddChatModal={setAddChatModal} user={user}/>}
          </>}
        </>}
      </>}
    </div>
  )
}

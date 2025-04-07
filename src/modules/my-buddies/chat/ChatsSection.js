import React, { useContext, useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useFetchDocsFilterIds from '../../../hooks/useFetchDocsFilterIds';
import ExistingChatList from './ExistingChatList';
import NewChatModal from './NewChatModal';
import Chat from './Chat';

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
  
  /* hooks
  --------------- */
  //active buddies data
  const activeBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
  const sharedUserData = useFetchDocsFilterIds(db,['sharedUserData'],buddyIds);

  /* useEffects
  --------------- */
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

  return (
    <div className='chat-container'>
      {activeBuddys && 
      <>
        {currentChat ? 
          <Chat currentChat={currentChat} setCurrentChat={setCurrentChat}/> : 
        <> 
          <h2>Chats</h2>
          {sharedUserData && <ExistingChatList sharedUserData={sharedUserData} user={user} setCurrentChat={setCurrentChat}/>}
          <button onClick={()=>{setAddChatModal(true)}}>+</button>
          {addChatModal === true && sharedUserData && <NewChatModal sharedUserData={sharedUserData} setCurrentChat={setCurrentChat} setAddChatModal={setAddChatModal} user={user}/>}
        </>}
      </>}
    </div>
  )
}

import React, { useContext, useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { db } from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import ExistingChatList from './ExistingChatList';
import Chat from './Chat';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useFetchDocsFilterIds from '../../../hooks/useFetchDocsFilterIds';

export default function ChatsSection() {
  // context for user
  const user = useContext(ContextUser);

  /*State
  ------------- */
  //state for opening a chat
  const [currentChat,setCurrentChat] = useState(null);
  // state for updating read status of message
  const [messageRead,setMessageRead] = useState({read:null,messageRead:null});
  const [buddyIds,setBuddyIds] = useState([]);
  

  /* Hooks
  -------------- */
  //update doc hook to change read status of message
  const updateReadMessage = useUpdateDoc(messageRead.read,db,['sharedUserData',messageRead.id]);
  //active buddies data
  const activeBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
  const sharedUserData = useFetchDocsFilterIds(db,['sharedUserData'],buddyIds);

  /* useEffect
  -------------- */
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

  //handling of when updateReadMessage is complete
  useEffect(()=>{
    if(updateReadMessage.isComplete === true) setMessageRead({read:null,messageRead:null});
  },[updateReadMessage.isComplete]);

  useEffect(()=>{
    console.log(sharedUserData)
  },[sharedUserData]);

  return (
    <div className='chat-container'>
      {currentChat ? 
      <Chat currentChat={currentChat} setCurrentChat={setCurrentChat}/> : 
      sharedUserData === undefined ?
      <TailSpin wrapperClass='loading-spinner' color="#00BFFF" height={80} width={80}/>
      :
      <ExistingChatList user={user} sharedUserData={sharedUserData} setCurrentChat={setCurrentChat} setMessageRead={setMessageRead}/>}
    </div>
  )
}

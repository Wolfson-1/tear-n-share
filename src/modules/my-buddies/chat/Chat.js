import React, { useState,useContext, useEffect } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import {db} from '../../../firebase/config';
import useAddDoc from '../../../hooks/useAddDoc';
import ChatMessage from './ChatMessage';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useUpdateDoc from '../../../hooks/useUpdateDoc';

export default function Chat({currentChat,setCurrentChat}) {
    // context for user
    const user = useContext(ContextUser);

    /* State
    ---------------------- */
    //state for storing text from message html input
    const [messageText,setMessageText] = useState(null);
    //state for hook to upload message object & to indicate if chat exists
    const [messageObj,setMessageObj] = useState(null);
    const [chatTracker,setChatTracker] = useState(null);
    //username for display at top of chat
    const [userTitle,setUserTitle] = useState(null);


    /* Hooks
    -----------------------*/
    //current chat history data to be applied to dom if exists
    const messageData = useFetchDocs(db,['sharedUserData',currentChat.id,'chat'],['createdAt']);
    //hook to uplaod new message on execution of sendMessage function
    const uploadMessage = useAddDoc(messageObj,db,['sharedUserData',currentChat.id,'chat']);
    const uploadChatTrack = useUpdateDoc(chatTracker,db,['sharedUserData',currentChat.id]);

    /*useEffects
    --------------------- */

    //useEffect to run on completion of uploadMessage & uplaodMessageTrack hook to clear message form text input & message Obj
    useEffect(()=>{
        if(uploadMessage.isComplete === true) setMessageObj(null);

        if(uploadChatTrack.isComplete === true) setChatTracker(null);
    },[uploadMessage.isComplete,uploadChatTrack.isComplete])

    useEffect(()=>{
        //pull user & id from chatPreview for display in DOM
        const chatUser = currentChat.matchedUsers.filter((match)=>{
            return match.userId !== user.userUid
        });
        setUserTitle(chatUser[0].userName);
    },[])

    /* Functions 
    ----------------------- */
    //function to handle sending message by creating object with needed data & uploading this to chat collection of shared user doc. 
    const sendMessage = (e) => {
    const dateNow = Date.now();
        e.preventDefault();
    // create object for uplaoding to chat in backend
    const obj ={
        sender:user.displayName,
        senderId:user.userUid,
        text: messageText,
        dateTimeSent: dateNow
    }
    //data to be added to sharedUser doc to track chat
    const chatTrack = {
        latestMessageUser: user.displayName,
        latestMessageText:messageText,
        latestMessageDateTime: dateNow,
        latestMessageRead: false
    }
    //set state for upload & update in backend
    setMessageObj([obj]);
    setChatTracker(chatTrack);
    setMessageText('');
    }
    
    return (
    <div>
      <button onClick={()=>{setCurrentChat(null)}}>{`<- Back`}</button>
      <h2>{userTitle}</h2>
      {messageData && <div className='message-reel'>
                            {messageData.map((message)=>{
                                return <ChatMessage message={message}/>
                            })}
                        </div>}
        <form>
            <input type='text' placeholder='Type here'id='messageText' name='messageText' value={messageText} onChange={(e) => {setMessageText(e.target.value)}}></input>
            <input onClick={sendMessage} type='submit' value='send'></input>
        </form>
    </div>
  )
}

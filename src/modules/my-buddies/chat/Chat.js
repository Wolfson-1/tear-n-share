import React, { useState,useContext, useEffect } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import {db} from '../../../firebase/config';
import useAddDoc from '../../../hooks/useAddDoc';
import ChatMessage from './ChatMessage';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import useUpdateDocs from '../../../hooks/useUpdateDocs';

export default function Chat({currentChat,setCurrentChat}) {
    // context for user
    const user = useContext(ContextUser);

    /* State
    ---------------------- */
    //state for storing text from message html input
    const [messageText,setMessageText] = useState(null);
    //state for hooks to upload message object & to indicate if chat exists
    const [messageObj,setMessageObj] = useState(null);
    const [chatTracker,setChatTracker] = useState(null);
    //username for display at top of chat
    const [userTitle,setUserTitle] = useState(null);
    // state for id's of unread messages to updat read status
    const [unreadIdsArr,setUnreadIdsArr] = useState(null);
    //state for displaying if last message has been read or not (for if user is looking at their own last message sent without a reply yet being received)
    const [lastMessageRead,setLastMessageRead] = useState(false);

    /* Hooks
    -----------------------*/
    //current chat history data to be applied to dom if exists
    const messageData = useFetchDocs(db,['sharedUserData',currentChat.id,'chat'],['createdAt']);
    //hook to uplaod new message on execution of sendMessage function
    const uploadMessage = useAddDoc(messageObj,db,['sharedUserData',currentChat.id,'chat']);
    const uploadChatTrack = useUpdateDoc(chatTracker,db,['sharedUserData',currentChat.id]);
    //hook for updating read messages status when user reads them
    const updateRead = useUpdateDocs({read:true},db,['sharedUserData',currentChat.id,'chat'],unreadIdsArr)

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

    //useEffect to run on completion of fetching messages to set unread messages to read
    useEffect(()=>{
        if(messageData){
            //init arr for pushing ids of received messages that are unread
            const unreadArr = [];
            
            // filter messageData down to ones from user & use if logic to push id's of messages to unreadArr if they are unread
            const received = messageData.filter(message => {
                return message.senderId !== user.userUid
            }).forEach(message => {
                if(message.read === false) unreadArr.push(message.id);
            });
            
            //if unread messages exist, set them to unreadIdsArr state for update in backend.
            if(unreadArr.length > 0) setUnreadIdsArr(unreadArr);     
        }
    },[messageData]);

    /* event handlers 
    ----------------------- */

    //function to handle sending message by creating object with needed data & uploading this to chat collection of shared user doc. 
    const handleMessageSend = (e) => {
    const dateNow = Date.now();
        e.preventDefault();

        //return out of sendMessage if no value to submit 
        if(!messageText || null) return;

    // create object for uplaoding to chat in backend
    const obj ={
        sender:user.displayName,
        senderId:user.userUid,
        text: messageText,
        dateTimeSent: dateNow,
        read:false
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
    };

    //handle key stroke so pressing enter submits message rather than create new line
    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
          handleMessageSend(e);
        }
      };
    
    return (
    <>
      <button onClick={()=>{setCurrentChat(null)}}>{`<- Back`}</button>
      <h2>{userTitle}</h2>
      <div className='message-reel'>
                            {messageData && messageData.map((message, index)=>{
                                //logic to set state for read message flag to display if last message was read or not
                                let lastMessage = false;
                                //once at last message run check for if message is read & sender matches userUid
                                if(index +1 === messageData.length) {
                                    //if logged in user maches user message & message is read then set last message to true
                                    if (user.userUid === message.senderId && message.read === true) {
                                        lastMessage = true ;
                                    } 
                                }

                                return <ChatMessage user={user} message={message} readMessage={lastMessage}/>
                            })}
                            {lastMessageRead && <p>Read </p>}
                        </div>
        <form className='chat-submit'>
            <textarea className='text' type='text' placeholder='Type here'id='messageText' name='messageText' value={messageText} onKeyDown={handleKeyDown} onChange={(e) => {setMessageText(e.target.value)}}></textarea>
            <input className='submit' onClick={handleMessageSend} type='submit' value='send'></input>
        </form>
    </>
  )
}

import React, { useState,useContext, useEffect } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import {db} from '../../../firebase/config';
import useAddDoc from '../../../hooks/useAddDoc';

export default function Chat({currentChat,setCurrentChat}) {
    // context for user
    const user = useContext(ContextUser);

    /* State
    ---------------------- */
    //state for storing text from message html input
    const [messageText,setMessageText] = useState(null);
    //state for hook to upload message object
    const [messageObj,setMessageObj] = useState(null);


    /* Hooks
    -----------------------*/
    const uploadMessage = useAddDoc(messageObj,db,['sharedUserData',currentChat.id,'chat'])

    /*useEffects
    --------------------- */

    //useEffect to run on completion of uploadMessage hook to clear message form text input & message Obj
    useEffect(()=>{
        if(uploadMessage.isComplete === true) {
            console.log('upload complete');
            setMessageObj(null);
        }
    },[uploadMessage.isComplete])


    /* Functions 
    ----------------------- */
    //function to handle sending message
    ///take data from input
    //upload object to correct shared object location
    //display with relevant info (text, sender, time & date sent) 
    //clear text from input

    const sendMessage = (e) => {
    e.preventDefault();
    // create object for uplaoding to chat in backend
    const obj ={
        sender:user.displayName,
        senderId:user.userUid,
        text: messageText,
        dateTimeSent: Date.now()
    }
    console.log(obj)
    setMessageObj([obj]);
    setMessageText('');
    }

    
    return (
    <div>
      <button onClick={()=>{setCurrentChat(null)}}>{`<- Back`}</button>
      <h2>{currentChat.displayName}</h2>
        <form>
            <input type='text' placeholder='Type here'id='messageText' name='messageText' value={messageText} onChange={(e) => {setMessageText(e.target.value)}}></input>
            <input onClick={sendMessage} type='submit' value='send'></input>
        </form>
    </div>
  )
}

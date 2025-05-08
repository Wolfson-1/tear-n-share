import React, { useState, useContext } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import SentRequests from './SentRequests';
import ReceivedRequest from './ReceivedRequests';

export default function RequestsSection() {
 //access user status from context
 const user = useContext(ContextUser);

  /* state
  ------------- */
  //state to manage toggle between sent & received sections
  const [sectionToggle,setSectionToggle] = useState('received');

  return (
    <div className='buddies-container'>
      <div className='active-inactive-toggle'>
        <button className={sectionToggle === 'received' ? 'active' : 'inactive'} onClick={()=>{if(sectionToggle !== 'received') setSectionToggle('received')}}>Received</button>
        <p>|</p>
        <button className={sectionToggle === 'sent' ? 'active' : 'inactive'} onClick={()=>{if(sectionToggle !== 'sent') setSectionToggle('sent')}}>Sent</button>
      </div>
      {sectionToggle === 'sent' && <SentRequests user={user}/>}
      {sectionToggle === 'received' && <ReceivedRequest user={user}/>}
    </div>
  )
}

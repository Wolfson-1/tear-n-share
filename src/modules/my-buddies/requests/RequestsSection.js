import React, { useState, useContext } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import SentRequests from './SentRequests';
import ReceivedRequests from './ReceivedRequests'

export default function RequestsSection() {
 //access user status from context
 const user = useContext(ContextUser);

  /* state
  ------------- */
  const [sectionToggle,setSectionToggle] = useState('sent');

  return (
    <div className='buddies-container'>
      <div>
        <button onClick={()=>{if(sectionToggle !== 'sent') setSectionToggle('sent')}}>Sent</button>
        <button onClick={()=>{if(sectionToggle !== 'received') setSectionToggle('received')}}>Received</button>

        {sectionToggle === 'sent' && <SentRequests user={user}/>}
        {sectionToggle === 'received' && <ReceivedRequests user={user}/>}
      </div>
    </div>
  )
}

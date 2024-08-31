import React, { useState } from 'react'

export default function RequestsSection() {

  /* state
  ------------- */
  const [sectionToggle,setSectionToggle] = useState('sent');

  return (
    <div className='buddies-container'>
      <div>
        <button onClick={()=>{if(sectionToggle !== 'sent') setSectionToggle('sent')}}>Sent</button>
        <button onClick={()=>{if(sectionToggle !== 'received') setSectionToggle('received')}}>Received</button>
      </div>
    </div>
  )
}

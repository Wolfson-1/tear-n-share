import React, { useState, useContext } from 'react'
import {ContextUser} from '../../../context/ContextUser';
import {db} from '../../../firebase/config';
import SentRequests from './SentRequests';
import ReceivedRequests from './ReceivedRequests'
import useDeleteDoc from '../../../hooks/useDeleteDoc';

export default function RequestsSection() {
 //access user status from context
 const user = useContext(ContextUser);

  /* state
  ------------- */
  //state to manage toggle between sent & received sections
  const [sectionToggle,setSectionToggle] = useState('sent');
  //state for deleted requests
  const [requestDelete,setRequestDelete] = useState(null);
  const [deletePath,setDeletePath] = useState(null);
  //array for requests ready for delete to be set to requestDelete on unmount of module
  const [deleteArr,setDeleteArr] = useState([]);

  /* hooks
  ------------- */
  //delete hook for removing requests after accept/reject & after user removes
  const deleteRequest = useDeleteDoc(requestDelete,db,deletePath);

  return (
    <div className='buddies-container'>
      <div>
        <button onClick={()=>{if(sectionToggle !== 'sent') setSectionToggle('sent')}}>Sent</button>
        <button onClick={()=>{if(sectionToggle !== 'received') setSectionToggle('received')}}>Received</button>

        {sectionToggle === 'sent' && <SentRequests user={user}/>}
        {sectionToggle === 'received' && <ReceivedRequests user={user} setRequestDelete={setRequestDelete} setDeletePath={setDeletePath} setDeleteArr={setDeleteArr} deleteArr={deleteArr}/>}
      </div>
    </div>
  )
}

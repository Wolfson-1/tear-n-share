import React, { useState, useEffect } from 'react'

  export default function DeleteAdModal({setDelete,setDeleteModal,sortedEvents,adId}) {
  
  //state for running delete check on confirmation of clicking yes button.
  const [deleteCheck,setDeleteCheck] = useState(false);
  //state for delete message required
  const [deleteError,setDeleteError] = useState(null);

  //delete check.if delete check set to true in deleteModal. Verify user can delete before setting actual ID for deletion (not outstanding balance owed). 
  useEffect(()=>{
    //if deleteCheck is still false, return/dont execute code 
    if(deleteCheck === false) return;

    //if logic to verify if loggedUser or paird user have unpaid events left if events have been logged. set state to show this in dom and return out of function;
    if(sortedEvents) {
      if(sortedEvents.unpaidLoggedLogs.length > 0) {
        setDeleteError('loggedPayments');
        setDeleteCheck(false);
        return;
      } else if(sortedEvents.unpaidPairedLogs.length > 0) { //if logged user is owed money prompt to make sure they are aware before proceeding
        setDeleteError(`pairedPayments`);
        setDeleteCheck(false);
        return;
      }
    };

    //if checks are complete and not triggered. set adId for deletion. 
    setDelete([adId]);
  },[deleteCheck]);

  return (
    <div className='modal-form-container'>
        <button className='close-modal' onClick={()=>setDeleteModal(null)}>x</button>
      {deleteError ?
      <>
        {deleteError === 'loggedPayments' && 
          <div>
            <p>You have existing unpaid balance. Please pay this before ending agreement.</p>
            <button onClick={()=>setDeleteModal(null)}>Okay</button>  
          </div>}
        {deleteError === 'pairedPayments' && 
          <div>
            <p>You are still owed an existing balance for this agreement. Are you sure you want to terminate?</p>
            <div>
              <button onClick={()=>setDelete([adId])}>Yes</button>
              <button onClick={()=>setDeleteModal(null)}>No</button>  
          </div>
          </div>}
      </>
      :
      <div>
          Are you sure you want to terminate this agreement?
          <div>
              <button onClick={()=>setDeleteCheck(true)}>Yes</button>
              <button onClick={()=>setDeleteModal(null)}>No</button>  
          </div>
      </div>}
    </div>
  )
}

import React from 'react'

export default function DeleteUserModal({setDisableMatch,deleteUserModal,setDeleteUserModal}) {
  return (
    <div className='modal-form-container'>
            <button className='close-modal' onClick={()=>setDeleteUserModal(null)}>x</button>
        <h3>Are you sure?</h3>
        <div>
            <button onClick={()=>setDisableMatch(deleteUserModal)}>Yes</button>
            <button onClick={()=>setDeleteUserModal(null)}>No</button>  
        </div>
        <p>You will no longer be able to access historical chat messages or comunnicate further with this user.</p>
    </div>
  )
}

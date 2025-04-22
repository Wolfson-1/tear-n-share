import React from 'react'

    export default function DeleteModal({setDelete,setDeleteModal,adId}) {
  return (
    <div className='modal-form-container'>
        <button className='close-modal' onClick={()=>setDeleteModal(null)}>x</button>
        Are you sure you want to terminate this agreement?
        <div>
            <button onClick={()=>setDelete(adId)}>Yes</button>
            <button onClick={()=>setDeleteModal(null)}>No</button>  
        </div>
    </div>
  )
}

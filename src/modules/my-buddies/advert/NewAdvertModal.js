import React from 'react'

export default function NewAdvertModal( {closeModal} ) {
  return (
    <div className='modal-background'>
        <div className='modal-form-container new-advert-modal-form-container'>
            <button onClick={() => {closeModal(false)}} className='close-modal'>x</button>
        </div>
    </div>
  )
}

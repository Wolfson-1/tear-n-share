import React from 'react'

export default function SimpleModal({message}) {
  return (
    <div className='modal-background show'>
        <h1>
        {message}    
        </h1>
    </div>
  )
}

import React from 'react'

export default function Modal({message}) {
  return (
    <div className='modal-background show'>
        <h1>
        {message}    
        </h1>
    </div>
  )
}

import React from 'react'

export default function SimpleModal({message,Prop}) {
  return (
    <div className='modal-background show'>
        {message && <h1>
        {message}    
        </h1>}
        {Prop && <Prop/>}
    </div>
  )
}

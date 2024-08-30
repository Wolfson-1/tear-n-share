import React from 'react'

export default function UserInfoModal({user,setUser}) {
  return (
    <div className='modal-background'>
      <button onClick={()=>{setUser(null)}}>close</button>
      <p>Testing Testing</p>
      <p>{user.displayName}</p>
    </div>
  )
}

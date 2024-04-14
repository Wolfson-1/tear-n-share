import React from 'react'

export default function MyAccountMain({setMyAccount}) {
  return (
    <div className='my-account-main'>
      <button onClick={() => {setMyAccount(false)}}>x</button>
    </div>
  )
}
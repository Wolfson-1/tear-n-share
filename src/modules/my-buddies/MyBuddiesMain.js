import React from 'react'

export default function MyBuddiesMain({setMyBuddies}) {
  return (
    <div className='my-buddies-main'>
      <button onClick={() => {setMyBuddies(false)}}>x</button>
    </div>
  )
}

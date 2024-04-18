import React, { useState } from 'react'
import ActiveSection from './ActiveSection'
import RequestsSection from './RequestsSection'
import AdvertSection from './AdvertSection'
import ChatsSection from './ChatsSection'

export default function MyBuddiesMain({setMyBuddies}) {

  const [selector,setSelector] = useState('active')

  return (
    <div className='my-buddies-main'>
      <button onClick={() => {setMyBuddies(false)}}>x</button>
      <div className='sections-selector'>
        <button className='selector-active' onClick={()=>{setSelector('active')}}>Active</button>
        <button className='selector-requests' onClick={()=>{setSelector('requests')}}>Requests</button>
        <button className='selector-adverts' onClick={()=>{setSelector('adverts')}}>Looking For</button>
        <button className='selector-chat' onClick={()=>{setSelector('chats')}}>Chats</button>
      </div>
      <div className='sections-container'>
        {selector === 'active' ? <ActiveSection/> : null}
        {selector === 'requests' ? <RequestsSection/> : null}
        {selector === 'adverts' ? <AdvertSection/> : null}
        {selector === 'chats' ? <ChatsSection/> : null}
      </div>
    </div>
  )
}

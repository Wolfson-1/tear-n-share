import React, { useState } from 'react'
import '../../css/buddiestylesheet.css';
import ActiveSection from './ActiveSection'
import RequestsSection from './requests/RequestsSection'
import AdvertSection from './advert/AdvertSection'
import ChatsSection from './ChatsSection'

export default function MyBuddiesMain({setMyBuddies}) {

  const [selector,setSelector] = useState('adverts')

  return (
    <div className='my-buddies-main'>
      <button className='buddies-close' onClick={() => {setMyBuddies(false)}}>x</button>
      <div className='sections-selector'>
        <button className='selector-adverts' onClick={()=>{setSelector('adverts')}}>Looking For</button>
        <button className='selector-active' onClick={()=>{setSelector('active')}}>Active Buddies</button>
        <button className='selector-requests' onClick={()=>{setSelector('requests')}}>Requests</button>
        <button className='selector-chat' onClick={()=>{setSelector('chats')}}>Chats</button>
      </div>
      <div className='sections-container'>
        {selector === 'adverts' ? <AdvertSection/> : null}
        {selector === 'active' ? <ActiveSection/> : null}
        {selector === 'requests' ? <RequestsSection/> : null}
        {selector === 'chats' ? <ChatsSection/> : null}
      </div>
    </div>
  )
}

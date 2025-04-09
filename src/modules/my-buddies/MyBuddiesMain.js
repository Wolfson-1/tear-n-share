import React, { useState } from 'react'
import '../../css/buddiestylesheet.css';
import ActiveSection from './active-buddies/ActiveSection'
import RequestsSection from './requests/RequestsSection'
import AdvertSection from './advert/AdvertSection'
import ChatsSection from './chat/ChatsSection'

export default function MyBuddiesMain({setMyBuddies}) {

  //state for selector of what section within buddys tab is currently showing
  const [mainSelector,setMainSelector] = useState('adverts')

  return (
    <div className='my-buddies-main'>
      <button className='buddies-close' onClick={() => {setMyBuddies(false)}}>x</button>
      <div className='sections-selector'>
        <button className='selector-adverts' onClick={()=>{setMainSelector('adverts')}}>Looking For</button>
        <button className='selector-active' onClick={()=>{setMainSelector('active')}}>Active Buddies</button>
        <button className='selector-requests' onClick={()=>{setMainSelector('requests')}}>Requests</button>
        <button className='selector-chat' onClick={()=>{setMainSelector('chat')}}>Chats</button>
      </div>
      <div className='sections-container'>
        {mainSelector === 'adverts' ? <AdvertSection/> : null}
        {mainSelector === 'active' ? <ActiveSection setMainSelector={setMainSelector}/> : null}
        {mainSelector === 'requests' ? <RequestsSection/> : null}
        {mainSelector === 'chat' ? <ChatsSection/> : null}
      </div>
    </div>
  )
}

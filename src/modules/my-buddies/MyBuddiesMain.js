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
      <button className='buddies-close' onClick={() => {setMyBuddies(false)}}>{'>'}</button>
      <div className='sections-selector'>
      <button className={`selector-adverts ${mainSelector === 'adverts' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector('adverts')}}>Looking For</button>
        <button className={`selector-active ${mainSelector === 'active' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector('active')}}>Active Buddies</button>
        <button className={`selector-requests ${mainSelector === 'requests' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector('requests')}}>Requests</button>
        <button className={`selector-chat ${mainSelector === 'chat' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector('chat')}}>Chats</button>
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

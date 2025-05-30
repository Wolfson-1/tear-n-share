import React, { useState, useEffect } from 'react'
import '../../css/buddiestylesheet.css';
import ActiveSection from './active-buddies/ActiveSection'
import RequestsSection from './requests/RequestsSection'
import AdvertSection from './advert/AdvertSection'
import ChatsSection from './chat/ChatsSection'

export default function MyBuddiesMain({ setMyBuddies }) {

  //state for selector of what section within buddys tab is currently showing
  const selectorsArr = ['adverts','active','requests','chat'];
  const [mainSelector,setMainSelector] = useState('adverts');
  const [underlineStyle,setUnderlineStyle] = useState({left:'0%'});

    //Move underline on mount and whenever activeIndex changes
    useEffect(() => {
      //find current position of selector using arr of selector options
      const currPos = selectorsArr.indexOf(mainSelector);
      //calculate value to offset underline from
      const offSet = 25 * currPos;

      //set state for underline offset position
      setUnderlineStyle({left:`${offSet}%`});
    }, [mainSelector]);

  return (
    <div className='my-buddies-main'>
      <button className='buddies-close' onClick={() => {setMyBuddies(false)}}>{'>'}</button>
      <div className='sections-selector'>
      <button className={`selector-adverts ${mainSelector === 'adverts' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector(selectorsArr[0])}}>Looking For</button>
        <button className={`selector-active ${mainSelector === 'active' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector(selectorsArr[1])}}>Active Buddies</button>
        <button className={`selector-requests ${mainSelector === 'requests' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector(selectorsArr[2])}}>Requests</button>
        <button className={`selector-chat ${mainSelector === 'chat' ? 'active' : 'inactive'}`} onClick={()=>{setMainSelector(selectorsArr[3])}}>Chats</button>
        <div class="underline" style={underlineStyle} ></div>
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

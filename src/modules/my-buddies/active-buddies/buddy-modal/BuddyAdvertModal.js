import React, { useEffect, useState, useContext } from 'react';
import {db} from '../../../../firebase/config';
import {ContextUser} from '../../../../context/ContextUser';
import Calendar from './Calendar';
import useFetchDocs from '../../../../hooks/useFetchDocs';
import LogEventModal from './log-event-modal/LogEventModal';

export default function BuddyAdvertModal({matchUserInfo,advert,setManageAd}) {

  // context for user
  const user = useContext(ContextUser);
  
  /* State
  ----------------*/
  //state for matched users (who is signed in and who is paired)
  const [sortedUsers,setSortedUsers] = useState(null);
  //state for module to add an aditional event (purchase or payment)
  const [logEvent,setLogEvent] = useState(null);
  //state for filtered logged data to unpaid purchase logs only
  const [unpaid,setUnpaid] = useState(null);

  /* Hooks
  ----------------*/
  //retrieve logged/management data for specific ad if any exists
  const loggedData = useFetchDocs(db,['sharedUserData',matchUserInfo.id,'matchedAdverts',advert.id,'advertLogs'],["createdAt"]);

  useEffect(()=>{
    //init filtered data variable & owed cost
    let filteredData
    //logic to filter loggedData if exists for purchase events that have not been paid
    if(loggedData && sortedUsers) {
      filteredData = loggedData.filter((data)=>{
        return data.eventType === 'purchase' && data.paid === false 
      })
    };
    
    setUnpaid(filteredData);
  },[loggedData,sortedUsers]);

  useEffect(()=>{
    if(matchUserInfo){
     setSortedUsers({loggedIn:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[0].userName : matchUserInfo.matchedUsers[1].userName,
              paired:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[1].userName : matchUserInfo.matchedUsers[0].userName
              })
    }
  },[matchUserInfo]);

  return (
    <div className='buddy-modal-manageAd'>
      <button className='back-button' onClick={()=>{setManageAd(null)}}>Go back</button>
      <div className='advert-info'>
          <p>Bread Type: <span>{advert.breadType}</span></p>
          <p>loaf Type: <span>{advert.loafType}</span></p>
          <p>Split: <span>{advert.breadSplit}%</span></p>
          <p>Spend: <span>£{advert.breadSpend}</span></p>
          <p>Reduced: <span>{advert.reduced ? 'Yes': 'No'}</span></p>
      </div>
      <div className='advert-info-ammend'>
            <button>Request Change</button>
            <button>End agreement</button>
      </div>
      <div className='paid-and-purchase-status'>
        <div className='purchase-status'>
          <p>Who bought last: <span></span></p>
          <p>Cost: <span></span></p>
          <p>Paid & delivered:<span></span></p>
        </div>
        <div className='balance-status'>
          <h3>Balance</h3>
          <div>
            <div>
              <p>{sortedUsers && sortedUsers.loggedIn}</p>
              <p>£</p>
            </div>
            <div>
              <p>{sortedUsers && sortedUsers.paired}</p>
              <p>£</p>
            </div>
          </div>
        </div>
      </div>
      <Calendar loggedData={loggedData}/>
      <div className='log-activity'>
        <button onClick={()=>{setLogEvent('purchase')}}>Log Purchase</button>
        <button onClick={()=>{setLogEvent('payment')}}>Log Payment</button>
      {logEvent && <LogEventModal user={user} unpaid={unpaid} eventType={logEvent} setLogEvent={setLogEvent} uploadPath={{sharedData:matchUserInfo.id,advert:advert.id}}/>}
      </div>
    </div>
  )
};

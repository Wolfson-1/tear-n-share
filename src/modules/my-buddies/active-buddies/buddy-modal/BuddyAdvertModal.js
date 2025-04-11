import React, { useState, useEffect } from 'react';
import {db} from '../../../../firebase/config';
import Calendar from './Calendar';
import useFetchDocs from '../../../../hooks/useFetchDocs';
import LogEventModal from './LogEventModal';

export default function BuddyAdvertModal({advert,setManageAd,sharedDataId}) {

  /* State
  ----------------*/
  const [logEvent,setLogEvent] = useState(null);

  /* Hooks
  ----------------*/
  //retrieve logged/management data for specific ad if any exists
  const loggedData = useFetchDocs(db,['sharedUserData',sharedDataId,'matchedAdverts',advert.id,'advertLogs'],["createdAt"]);


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
              <p>User</p>
              <p>£</p>
            </div>
            <div>
              <p>User</p>
              <p>£</p>
            </div>
          </div>
        </div>
      </div>
      <Calendar loggedData={loggedData}/>
      <div className='log-activity'>
        <button onClick={()=>{setLogEvent('purchase')}}>Log Purchase</button>
        <button onClick={()=>{setLogEvent('payment')}}>Log Payment</button>
      {logEvent && <LogEventModal eventType={logEvent} setLogEvent={setLogEvent} uploadPath={{sharedData:sharedDataId,advert:advert.id}}/>}
      </div>
    </div>
  )
}

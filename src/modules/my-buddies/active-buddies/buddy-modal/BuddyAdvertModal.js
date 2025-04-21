import React, { useEffect, useState, useContext } from 'react';
import {db} from '../../../../firebase/config';
import {ContextUser} from '../../../../context/ContextUser';
import Calendar from './Calendar';
import useFetchDocs from '../../../../hooks/useFetchDocs';
import LogEventModal from './log-event-modal/LogEventModal';
import EventModal from './EventModal';

export default function BuddyAdvertModal({matchUserInfo,advert,setManageAd}) {

  // context for user
  const user = useContext(ContextUser);
  
  /* State
  ----------------*/
  //state for matched users (who is signed in and who is paired)
  const [sortedUsers,setSortedUsers] = useState(null);
  //state for module to add an aditional event (purchase or payment)
  const [eventModal,setEventModal] = useState(null);
  const [calEvent,setCalEvent] = useState(null);
  //state for filtered data outlining unpaid purchase logs only & their total value
  const [sortedEvents,setSortedEvents] = useState(null);

  /* Hooks
  ----------------*/
  //retrieve logged/management data for specific ad if any exists
  const loggedData = useFetchDocs(db,['sharedUserData',matchUserInfo.id,'matchedAdverts',advert.id,'advertLogs'],["eventDate",'desc']);


  /* useEffects
  ----------------*/
  useEffect(()=>{
    // logic to seperate user specific data for loading to dom (for logged in user & secondary user)
    if(matchUserInfo){
     setSortedUsers({loggedIn:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[0].userName : matchUserInfo.matchedUsers[1].userName,
              paired:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[1].userName : matchUserInfo.matchedUsers[0].userName
              })
    }
  },[matchUserInfo]);

  //useEffect runs when sorted users & matchUserInfo are both available to sort current outstanding logged payments by each user for props & display in dom
  useEffect(()=>{
    console.log(loggedData);

    //init filtered data variable & owed cost
    let loggedInUnpaidArr = [];
    let loggedInPaidArr = [];
    let pairedUnpaidArr = [];
    let pairedPaidArr = []; 

    //logic to filter loggedData if exists for purchase events that have not been paid
    if(loggedData && sortedUsers) {
      loggedData.forEach((data)=>{
        //logic to continue only if paid status is false (currently unpaid)
        if(data.paid === false) {
          //logic to push unpaid event to correct array for either upaind by logged user or unpaid by paired user
          if(data.eventUser === sortedUsers.loggedIn) {
            pairedUnpaidArr.push(data)
          }  else if(data.eventUser === sortedUsers.paired) {
            loggedInUnpaidArr.push(data)
          }
        } else if (data.paid === true) {
          //logic to push unpaid event to correct array for either upaind by logged user or unpaid by paired user
          if(data.eventUser === sortedUsers.loggedIn) {
            pairedPaidArr.push(data)
          }  else if(data.eventUser === sortedUsers.paired) {
            loggedInPaidArr.push(data)
          }
        }
      })
      
      //Reduce on outstanding payments for logged in and paired user
      const loggedTotUnpaid = loggedInUnpaidArr.reduce((acc,curr,index)=>{
        if(curr.paid === false) acc.unpaidVal+=parseFloat(curr.purchasePrice);
        acc.unpaidIndex = index;
        return acc
      },{ unpaidVal: 0, unpaidIndex: null });

      const pairedTotUnpaid = pairedUnpaidArr.reduce((acc,curr,index)=>{
        if(curr.paid === false) acc.unpaidVal+=parseFloat(curr.purchasePrice);
        acc.unpaidIndex = index;
        return acc
      },{ unpaidVal: 0, unpaidIndex: null });

      //most recent payment for loading to dom
      const mostRecentPurch = loggedData.find((item)=>{
        return item.eventType === 'purchase'
      });

      setSortedEvents({unpaidLoggedLogs: loggedInUnpaidArr,
                paidLoggedLogs: loggedInPaidArr,
                unpaidPairedLogs: pairedUnpaidArr,
                paidPairedLogs: pairedPaidArr,
                unpaidLoggedTot: loggedTotUnpaid,
                unpaidPairedTot: pairedTotUnpaid,
                mostRecentPurch: mostRecentPurch
              })
    };
  },[loggedData,sortedUsers]);

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
      <div className='log-activity'>
        <button onClick={()=>{setEventModal('purchase')}}>Log Purchase</button>
        <button onClick={()=>{setEventModal('payment')}}>Log Payment</button>
      </div>
      {sortedEvents ? <div className='paid-and-purchase-status'>
        <div className='purchase-status'>
          <p>Who bought last: {sortedEvents.mostRecentPurch.eventUser}</p>
          <p>Cost: {sortedEvents.mostRecentPurch.purchasePrice}</p>
          <p>Paid: {sortedEvents.mostRecentPurch.paid === true ? 'Yes' : 'No'}<span></span></p>
        </div>
        <div className='balance-status'>
          <h3>Balance</h3>
          <div>
            <div>
              <p>{sortedUsers.loggedIn}</p>
              <p>£{sortedEvents.unpaidLoggedTot.unpaidVal}</p>
            </div>
            <div>
              <p>{sortedUsers.paired}</p>
              <p>£{sortedEvents.unpaidPairedTot.unpaidVal}</p>
            </div>
          </div>
        </div>
      </div>
      :
      <div>
        Log events to see tracking stats.
      </div>}
      <Calendar loggedData={loggedData} setCalEvent={setCalEvent}/>
      <div className='advert-info-ammend'>
        <button>End agreement</button>
      </div>
      {eventModal && <LogEventModal advert={advert} sortedEvents={sortedEvents} eventType={eventModal} setEventModal={setEventModal} uploadPath={{sharedData:matchUserInfo.id,advert:advert.id}}/>}
      {calEvent && <EventModal event={calEvent} setCalEvent={setCalEvent} sortedEvents={sortedEvents}/>}
    </div>
  )
};

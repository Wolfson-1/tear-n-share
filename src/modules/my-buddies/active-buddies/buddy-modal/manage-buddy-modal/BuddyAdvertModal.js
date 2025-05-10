import React, { useEffect, useState, useContext } from 'react';
import {db} from '../../../../../firebase/config';
import { ContextNotification } from '../../../../../context/ContextNotification';
import Calendar from '../calander/Calendar';
import useFetchDocs from '../../../../../hooks/useFetchDocs';
import LogEventModal from '../log-event-modal/LogEventModal';
import EventModal from './EventModal';
import DeleteAdModal from '../delete-modules/DeleteAdModal';
import useDeleteDoc from '../../../../../hooks/useDeleteDoc';
import CalendarMonth from '../calander/CalendarMonth';
import { TailSpin } from 'react-loader-spinner';

export default function BuddyAdvertModal({matchUserInfo,sortedUsers,advert,setManageAd}) {

  // context for user
  const notificationsUpdate = useContext(ContextNotification);

  /* State
  ----------------*/
  //state for module to add an aditional event (purchase or payment)
  const [eventModal,setEventModal] = useState(null);
  //state for calendar related events (calEvent=state to open modal with a specific calander event info, monmthCalander = state to open month wide calendar.)
  const [calEvent,setCalEvent] = useState(null);
  const [calendarMonth,setCalendarMonth] = useState(false);
  //state for filtered data outlining unpaid purchase logs only & their total value
  const [sortedEvents,setSortedEvents] = useState(null);
  //state for activating delete ad modal & for ids to add to delete hook afer checks.
  const [deleteModal,setDeleteModal] = useState(null);
  const [deleteAdId,setDeleteAdId] = useState(null);

  /* Hooks
  ----------------*/
  //retrieve logged/management data for specific ad if any exists
  const loggedData = useFetchDocs(db,['sharedUserData',matchUserInfo.id,'matchedAdverts',advert.id,'advertLogs'],["eventDate",'desc']);
  //delete hook to remove ad if user choses to end agreement
  const deleteAd = useDeleteDoc(deleteAdId,db,['sharedUserData',matchUserInfo.id,'matchedAdverts']);

  //useEffect runs when sorted users & matchUserInfo are both available to sort current outstanding logged payments by each user for props & display in dom
  useEffect(()=>{
    //if loggedData or no sorted users yet, return
    if(!loggedData || !sortedUsers) return

    //init filtered data variable & owed cost
    let loggedInUnpaidArr = [];
    let loggedInPaidArr = [];
    let pairedUnpaidArr = [];
    let pairedPaidArr = []; 

    //logic to filter loggedData if exists for purchase events that have not been paid
    if(loggedData.length > 0) {
      loggedData.forEach((data)=>{
        //logic to continue only if paid status is false (currently unpaid)
        if(data.paid === false) {
          //logic to push unpaid event to correct array for either upaind by logged user or unpaid by paired user
          if(data.eventUser === sortedUsers.loggedIn.userName) {
            pairedUnpaidArr.push(data)
          }  else if(data.eventUser === sortedUsers.paired.userName) {
            loggedInUnpaidArr.push(data)
          }
        } else if (data.paid === true) {
          //logic to push unpaid event to correct array for either upaind by logged user or unpaid by paired user
          if(data.eventUser === sortedUsers.loggedIn.userName) {
            pairedPaidArr.push(data)
          }  else if(data.eventUser === sortedUsers.paired.userName) {
            loggedInPaidArr.push(data)
          }
        }
      })
      
      //Reduce on outstanding payments for logged in and paired user
      const loggedTotUnpaid = loggedInUnpaidArr.reduce((acc,curr,index)=>{
        if(curr.paid === false) acc.unpaidVal+=parseFloat(curr.costRatio.pairedUser);
        acc.unpaidIndex = index;
        return acc
      },{ unpaidVal: 0, unpaidIndex: null });

      const pairedTotUnpaid = pairedUnpaidArr.reduce((acc,curr,index)=>{
        if(curr.paid === false) acc.unpaidVal+=parseFloat(curr.costRatio.pairedUser);
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

  /* useEffects
  ----------------*/

  //isComplete cleanup useEffect after hooks finish
  useEffect(()=>{
    if(deleteAd.isComplete === true) {
        //set Reducer state using context for sending a notification of new message
        notificationsUpdate.updateDispatch( {type:'add-notification',
          payload:{type:'delete-event',
                  userName: sortedUsers.loggedIn.userName,
                  userId: sortedUsers.loggedIn.userId,
                  deleteType:'advert'
                  },
          sendId: sortedUsers.paired.userId
      });

      setDeleteAdId(null);
      setManageAd(null);
    }
  },[deleteAd]);

  return (
    <div className='buddy-modal-manageAd'>
      <button className='back-button' onClick={()=>{setManageAd(null)}}>Go back</button>
      {loggedData ? 
      <>
        <div className='advert-info'>
            <p>Bread Type: <span>{advert.breadType}</span></p>
            <p>loaf Type: <span>{advert.loafType}</span></p>
            <p>Split: <span>{advert.breadSplit}%</span></p>
            <p>Max Spend: <span>£{advert.breadSpend}</span></p>
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
                <p>{sortedUsers.loggedIn.userName}</p>
                <p>£{sortedEvents.unpaidLoggedTot.unpaidVal}</p>
              </div>
              <div>
                <p>{sortedUsers.paired.userName}</p>
                <p>£{sortedEvents.unpaidPairedTot.unpaidVal}</p>
              </div>
            </div>
          </div>
        </div>
        :
        <div>
          Log events to see tracking stats.
        </div>}
        <Calendar loggedData={loggedData} setCalEvent={setCalEvent} setCalendarMonth={setCalendarMonth}/>
        <div className='advert-info-ammend'>
          <button onClick={()=>setDeleteModal(true)}>End agreement</button>
        </div>
      </>
      :
      <TailSpin wrapperClass='loading-spinner' color="#00BFFF" height={80} width={80}/>}
      {eventModal && <LogEventModal advert={advert} sortedEvents={sortedEvents} eventType={eventModal} setEventModal={setEventModal} uploadPath={{sharedData:matchUserInfo.id,advert:advert.id}} notificationUser={sortedUsers.paired}/>}
      {calEvent && <EventModal event={calEvent} setCalEvent={setCalEvent} sortedEvents={sortedEvents}/>}
      {deleteModal && <DeleteAdModal setDelete={setDeleteAdId} setDeleteModal={setDeleteModal} sortedEvents={sortedEvents} adId={advert.id}/>}
      {calendarMonth && <CalendarMonth setCalendarMonth={setCalendarMonth} loggedData={loggedData} setCalEvent={setCalEvent}/>}
    </div>
  )
};

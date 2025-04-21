import React, { useState, useEffect } from 'react'

export default function EventModal({event,setCalEvent,sortedEvents}) {

    /* useState
    ------------------*/
    const [associatedEvents,setassociatedEvents] = useState(null);


    /*useEffects
    ----------------- */

    useEffect(()=>{
        //if logic to run sort only if event type is 'payment'
        if(event.eventType === 'payment') {
            //init arr to push purchase events associated with payment to
            const purchasesCoveredArr = []
            event.purchasesPaid.forEach(id => {
                sortedEvents.paidLoggedLogs.forEach((item)=>{
                    item.id === id && purchasesCoveredArr.push(item)
                })
            });
            //set state for filtered array of objects
            setassociatedEvents(purchasesCoveredArr);
        }
    },[]);

  return (
    <div className='modal-background'>
    {event.length > 0 ? 
    <div className='modal-form-container'>
        <div className='modal-header'>
            <h2>Choose Event</h2>
            <button className='close-modal' onClick={()=>{setCalEvent(null)}}>x</button>
        </div>
        <div className='events-reel'>
            {event.map((event)=>{
                return <div onClick={()=>{setCalEvent(event)}}>
                <p>Event Type: {event.eventType}</p>
                <p>Logged By: {event.eventUser}</p>
                </div>
            })}
        </div>
    </div>
    : 
    <div className='modal-form-container'>
        <div className='modal-header'>
            <h2>Event</h2>
            <button className='close-modal' onClick={()=>{setCalEvent(null)}}>x</button>
        </div>
        <div className='event-info'>
            <p>Event Type: {event.eventType}</p>
            <p>Date of event: {event.eventDate}</p>
            <p>Event Logged by: {event.eventUser}</p>
        </div>
        {event.eventType === 'purchase' && <div className='event-specific'>
            <p>Purchase Price: £{event.purchasePrice}</p>
            <p>Purchase Store: {event.store}</p>
            {event.store === 'other' && <p>Different Store Reasoning:{event.storeReasoning}</p>}
            <p>Does Purchase Differ from Purchase Advert specification?: {event.purchaseDiff ? 'Yes' : 'No'}</p>
            {event.purchaseDiff &&<p>Difference & Reasoning: {event.diffReasoning}</p>}
            <p> Event Status: {event.paid ? 'Paid' : 'Unpaid'}</p>
        </div>}
        {event.eventType === 'payment' && <div>
            <p>Total Amount Paid: £{event.totalPaid}</p>
            <h3>Purchases Covered</h3>
            {associatedEvents && associatedEvents.map((event)=>{
                return <div>
                        <p>Date: {event.eventDate}</p>
                        <p>£{event.purchasePrice}</p>
                    </div>
            })}
        </div>}
        </div>}
    </div>
  )
}

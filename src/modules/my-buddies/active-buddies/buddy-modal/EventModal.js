import React from 'react'

export default function EventModal({event,setCalEvent}) {

  console.log(event);

  return (
    <div className='modal-background'>
        <div className='modal-form-container'>
            <div className='modal-header'>
                        <h2>eventModal</h2>
                        <button className='close-modal' onClick={()=>{setCalEvent(null)}}>x</button>
            </div>
        <div className='event-info'>
            <p>Event Type: {event.eventType}</p>
            <p>Date of event: {event.eventDate}</p>
            <p>Event Logged by: {event.eventUser}</p>
        </div>
        {event.eventType === 'purchase' && <div className='event-specific'>
            <p>Price Purchase: £{event.purchasePrice}</p>
            <p>Does Price Exceed Agreed Purchase Limit?: {event.purchaseDiff ? 'Yes' : 'No'}</p>
            {event.purchaseDiff &&<p>Price Difference Reasoning: {event.diffReasoning}</p>}
            <p> Event Status: {event.paid ? 'Paid' : 'Unpaid'}</p>
        </div>}
        {event.eventType === 'payment' && <div>
            <p>Total Amount Paid: £{event.totalPaid}</p>
        </div>}
        </div>
    </div>
  )
}

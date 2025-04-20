import React from 'react'

export default function DayInformation({logged,setCalEvent}) {
  
  //stle object for conditional color of event obkects
  const css = {paid:'#3d8f3d',unpaid:'#bf4040'};

  return (
    <div onClick={()=>{setCalEvent(logged)}} className='logged-event' style={logged.eventType === 'purchase' ? {backgroundColor:logged.paid ? css.paid : css.unpaid} : {backgroundColor:'#5973a6'}}
        >
    <p>event:</p>
    <p>{logged.eventType}</p>
    </div>
  )
}

import React from 'react'

export default function DayInformation({logged,setCalEvent}) {
  
  //stle object for conditional color of event obkects
  const css = {paid:'#3d8f3d',unpaid:'#bf4040'};

  //work out dynamic height out of 50% for each item
  const dynamicHeight = 45 / logged.length

  console.log(dynamicHeight);
    
  return (
    logged.length < 5 ? logged.map((log)=>{
        return <div onClick={()=>{setCalEvent(log)}} className='logged-event' style={log.eventType === 'purchase' ? {backgroundColor:logged.paid ? css.paid : css.unpaid,maxHeight:`${dynamicHeight}%`} : {backgroundColor:'#5973a6',maxHeight:`${dynamicHeight}%`}}>
            <p>event:</p>
            <p>{log.eventType}</p>
        </div>
    }) 
    : 
    <div className='logged-event' onClick={()=>{setCalEvent(logged)}} style = {{backgroundColor:'#ffffff21',maxHeight:'45%'}}> 5+ Events... </div>
  )
}

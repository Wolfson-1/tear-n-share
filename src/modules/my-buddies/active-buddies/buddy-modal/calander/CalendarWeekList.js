import React from 'react'
import DayInformation from './DayInformation';

export default function CalendarWeekList({currCalendar,setCalEvent,loggedData,condMonth}) { 
  //NOTES: 
    //condMonth = current month for conditional formatting of days in week that dont fall within current month (to blank them out, different background etc)
    //currCalendar = arr of current days in week to populate grid
    //setCalEvent = setter for setting modal event for popout in wider modal outside calendar
    // loggedData = array of all events to be populated on calendar days where event exists

  //days of year & months for populating calendar in DOM
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

  //CSS styling for tiles
  const currMonthStyle = {backgroundColor:`rgba(${244}, ${244}, ${244}, ${0.150})`}
  const diffMonthStyle = {backgroundColor:'none'}

  return (
    <div className='calendar-elements'>
    {daysOfWeek.map((day,index)=>{
        // logic to search for maching logged data to mark respective section in calander
        let logged
        if(loggedData) {
          logged = loggedData.filter((data)=>{
            return data.eventDate === `${currCalendar[index].year}-${currCalendar[index].month}-${currCalendar[index].day}`
          });
        } else {
          logged = null;
        }

        return <div className='calendar-day' style={condMonth ? condMonth === currCalendar[index].month ? {gridColumn:`${index+1}/${index+2}`,...currMonthStyle} : {gridColumn:`${index+1}/${index+2}`,diffMonthStyle} : {gridColumn:`${index+1}/${index+2}`,...currMonthStyle}}>
          <div className='day-date'>
            <p>{day}</p>
            <p>{currCalendar[index].day}</p>
          </div>
          {logged && logged.length > 0 && <DayInformation logged={logged} setCalEvent={setCalEvent}/>}
        </div>
      })}
    </div>
  )
}

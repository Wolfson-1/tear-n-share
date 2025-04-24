import React from 'react'
import DayInformation from './DayInformation';

export default function CalendarWeekList({currCalendar,setCalEvent,loggedData}) {
  
  //days of year & months for populating calendar in DOM
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

  return (
    <div className='calendar-elements'>
    {daysOfWeek.map((day,index)=>{
        // logic to search for maching logged data to mark respective section in calander
        let logged
        if(loggedData) {
          logged = loggedData.filter((data)=>{
            return data.eventDate === `${currCalendar.currWeek[index].year}-${currCalendar.currWeek[index].month}-${currCalendar.currWeek[index].day}`
          });
        } else {
          logged = null;
        }

        return <div className='calendar-day' style={{gridColumn:`${index+1}/${index+2}`}}>
          <div className='day-date'>
            <p>{day}</p>
            <p>{currCalendar.currWeek[index].day}</p>
          </div>
          {logged && logged.length > 0 && <DayInformation logged={logged} setCalEvent={setCalEvent}/>}
        </div>
      })}
    </div>
  )
}

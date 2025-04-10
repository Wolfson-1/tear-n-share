import React, {useEffect, useState} from 'react'

export default function Calendar() {

  /* State
  ------------------------ */
  //state to offset current week
  const [offSetDate,setOffSetDate] = useState(0);
  //current calander state object for populating dom
  const [currCalendar,setCurrCalendar] = useState(null);

  //days of year & months for populating calendar in DOM
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /*useEffect
  ------------------------- */
  //Use current date to set data needed to populate calander 
  useEffect(()=>{
    //day in milliseconds for offset
    const dayMilli = 86400000;

    //get current month, date, and day of the week
    //factor in offset days if user is looking back through weeks
    const epoch = offSetDate > 0 ? Date.now() - (offSetDate*dayMilli) : Date.now();
    //create new date based off offset & following variables for month date day etc.
    const d = new Date(epoch);
    const month = months[d.getMonth()];
    const date = d.getDate();
    const day = daysOfWeek[d.getDay()];


    //use current day to find index of the current dates day in a full week
    const dayIndex = daysOfWeek.indexOf(day);
    
    //dates arr & for loop to match current days of the week using dayIndex
    let currWeekDates = [];
    //for loop to add current dates for full week
    for (let i = 0; i < 7; i++) {
      currWeekDates.push(new Date(epoch - (dayMilli*(dayIndex-i))).getDate())
    };

    setCurrCalendar({
      date:date,
      day: day,
      month:month,
      currWeek:currWeekDates
    })
  },[offSetDate]);

  /*Event handlers 
  ---------------------*/
  const offsetWeek = (plusOrMinus) => {
    if(plusOrMinus === '-') {
      setOffSetDate(offSetDate + 7);
    } else if(plusOrMinus === '+') {
      if(offSetDate === 0) return;
      if(offSetDate > 0) {
        setOffSetDate(offSetDate - 7);
      }
    };
  };

  return (
    <>
      {currCalendar && <div className='calendar'>
        <div className='calendar-buttons'>
        <button onClick={()=>{offsetWeek('-')}}>{'<'}</button>
          <button onClick={()=>{offsetWeek('+')}}>{'>'}</button>
        </div>
        <h3>Month:{currCalendar.month}</h3>
        <div className='calendar-elements'>
        {daysOfWeek.map((day,index)=>{
          return <div style={{gridColumn:`${index+1}/${index+2}`}}>
            {day}
            {currCalendar.currWeek[index]}
          </div>
        })}
        </div>
      </div>}
    </>

  )
}

import React, {useEffect, useState} from 'react'
import DayInformation from './DayInformation'

export default function Calendar({loggedData,setCalEvent}) {

  /* State
  ------------------------ */
  //state to offset current week
  const [offSetDate,setOffSetDate] = useState(0);
  //current calander state object for populating dom
  const [currCalendar,setCurrCalendar] = useState(null);

  //days of year & months for populating calendar in DOM
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthsIndex = ['01','02','03','04','05','06','07','08','09','10','11','12']

  /*useEffect
  ------------------------- */
  //Use current date to set data needed to populate calander 
  useEffect(()=>{
    //day in milliseconds for offset
    const dayMilli = 86400000;

    //get current month, date, and day of the week
    //factor in offset days if user is looking back through weeks
    const epoch = offSetDate > 0 ? Date.now() - (offSetDate*dayMilli) : Date.now();
    //create new date based off offset & following variables for month date day & year.
    const d = new Date(epoch);
    const month = months[d.getMonth()];
    const date = d.getDate();
    const day = daysOfWeek[d.getDay()];
    const year = d.getFullYear();


    //use current day to find index of the current dates day in a full week
    const dayIndex = daysOfWeek.indexOf(day);
    
    //dates arr & for loop to match current days of the week using dayIndex
    let currWeekDates = [];
    //for loop to add current dates for full week
    for (let i = 0; i < 7; i++) {
      //init date & month for use with logic in pushing to array for current weeks dates.(+1 needed for month to align with date added via form)
      const day = new Date(epoch - (dayMilli*(dayIndex-i))).getDate();
      const month = new Date(epoch - (dayMilli*(dayIndex-i))).getMonth()+1;
      //Push object containing day,month,year to current week dates array.
      currWeekDates.push({day: day < 10 ? `0${day}` : day.toString(),
                          month: month < 10 ? `0${month}` : month.toString(),
                          year:new Date(epoch - (dayMilli*(dayIndex-i))).getFullYear().toString()});
    };

    //set current calander object for use in dom
    setCurrCalendar({
      date: date,
      day: day,
      month:month,
      year:year,
      currWeek:currWeekDates
    })
  },[offSetDate]);

  /*Event handlers 
  ---------------------*/
  //function for onClick of offset buttons in calander to change offset value & display historical weeks rather than just current week.
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
        <h3 className='calendar-month'>{currCalendar.month},{currCalendar.year.toString()}</h3>
        <div className='calendar-elements'>
        {daysOfWeek.map((day,index)=>{
          // logic to search for maching logged data to mark respective section in calander
          let logged
          if(loggedData) {
            logged = loggedData.find((data)=>{
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
            {logged && <DayInformation logged={logged} setCalEvent={setCalEvent}/>}
          </div>
        })}
        </div>
      </div>}
    </>

  )
}

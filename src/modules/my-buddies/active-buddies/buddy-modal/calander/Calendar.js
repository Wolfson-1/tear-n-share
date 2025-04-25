import React, {useEffect, useState} from 'react';
import * as calendarUtils from '../../../../../utils/calendarUtils';
import CalendarWeekList from './CalendarWeekList';

export default function Calendar({loggedData,setCalEvent,setCalendarMonth}) {

  /* State
  ------------------------ */
  //state to offset current week
  const [offSetDate,setOffSetDate] = useState(0);
  //current calander state object for populating dom
  const [currCalendar,setCurrCalendar] = useState(null);

  /*useEffect
  ------------------------- */
  //Use current date to set data needed to populate calander 
  useEffect(()=>{
    //get current week based on todays date using getCurrentWeek util function
    const currWeek = calendarUtils.getCurrentWeek(null,offSetDate);
    console.log(currWeek);
    //set currentWeeks data
    setCurrCalendar(currWeek);
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
      {currCalendar && <div className='calendar week'>
        <div className='calendar-buttons'>
          <div className='cycle-weeks'>
            <button onClick={()=>{offsetWeek('-')}}>{'<'}</button>
            <button onClick={()=>{offsetWeek('+')}}>{'>'}</button>
          </div>
          <button className='open-month' onClick={()=>setCalendarMonth(true)}>Open Month</button>
        </div>
        <h3 className='calendar-month'>{currCalendar.month},{currCalendar.year.toString()}</h3>
        <CalendarWeekList currCalendar={currCalendar.currWeek} setCalEvent={setCalEvent} loggedData={loggedData}/>
      </div>}
    </>

  )
}

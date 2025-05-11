import React, { useEffect, useState } from 'react'
import * as calendarUtils from '../../../../../utils/calendarUtils';
import CalendarWeekList from './CalendarWeekList';

export default function CalendarMonth({setCalendarMonth,setCalEvent,loggedData}) {

    /*useState 
    ---------------------*/
    //offset month state to pass down to generating this months weeks & to alter in order to cycle back through historical months.
    const [historicalMonth,setHistoricalMonth] = useState(null);
    //state for actual date st on intiial render of calendar that wont change with cycling through months.
    const [actualDate,setActualDate] = useState(null);
    //state for holding set of arr's containing curr month's weeks.
    const [currDay,setCurrDay] = useState(null);
    const [monthArr,setMonthArr] = useState(null);

    /*useEffect
    ---------------------*/

    useEffect(()=>{
      //use getCalendarMonth function to generate all weeks of this month based off current date.
      const currMonth = calendarUtils.getCalendarMonth(historicalMonth);

      //set state for currMonth & currDay in relation to getCalendarMonth export
      setMonthArr(currMonth.currMonth);
      setCurrDay(currMonth.currDay);

      //if historicalMonth data is null (therefore data generated is for current month on load of calendar module) set actualDate obj that can be used as a reference point whilst rest of month data is altered.
      if(historicalMonth === null) setActualDate(currMonth.currDay);

    },[historicalMonth]);

    /* eventHandler
    -----------------------*/
    const changeMonth = (plusOrMinus) => {
      //Notes: 
        // When state for hitorical month is changed current day is set to 15. This is to ensure that month is always retreived based on the date if user is accessing calendar on fringe days that dont exist in other months (eg: 31 would result in error for month of Feburary) 

    //state to assign to historical month data once altered in line with plus or minus month
    let changeMonth =''

      ////if logic to ammend & assign changeMonth vlaue based on if plus or minus argument passed to function
      if(plusOrMinus === '-') {
        if(currDay.monthIndex == 1) { //check if month is January. as additional change to year needed if the case 
          changeMonth = new Date(`${(currDay.year -1)}-${12}-15`).getTime();
        } else {
          changeMonth = new Date(`${currDay.year}-${Number(currDay.monthIndex) - 1 }-15`).getTime();
        }
      } else if(plusOrMinus === '+') {
        //check for if on current month of the year & return if true so user can't cycle to future months
        if(actualDate.monthIndex === currDay.monthIndex && actualDate.year === currDay.year) return;
        if(currDay.monthIndex == 12) { //check if month is december. as additional change to year needed if the case
          changeMonth = new Date(`${(Number(currDay.year) + 1)}-${1}-15`).getTime();
        } else {
          changeMonth = new Date(`${currDay.year}-${Number(currDay.monthIndex) + 1 }-15`).getTime();
        }
      };

      //set historicl month state to re-run month data for calendar
      setHistoricalMonth(changeMonth);
    };

    return (
    <>
      {monthArr && currDay && <div className='modal-form-container month'>
        <button onClick={()=>{setCalendarMonth(false)}}>x</button>
        <div className='calendar month'> 
          <div className='calendar-buttons'>
              <button onClick={()=>{changeMonth('-')}}>{'<'}</button>
              <button onClick={()=>{changeMonth('+')}}>{'>'}</button>
          </div>
          <h3 className='calendar-curr-month'>{currDay.month},{currDay.year.toString()}</h3>
          <div className='weeks-container'>
            {monthArr.map((item)=>{
              return <CalendarWeekList currCalendar={item} setCalEvent={setCalEvent} loggedData={loggedData} condMonth={currDay.monthIndex}/>
            })}
          </div>
        </div>
      </div>}
    </>  
  )
}

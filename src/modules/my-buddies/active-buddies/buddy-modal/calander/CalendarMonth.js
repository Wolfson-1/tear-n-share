import React, { useEffect, useState } from 'react'
import * as calendarUtils from './calendarUtils';
import CalendarWeekList from './CalendarWeekList';

export default function CalendarMonth({setCalendarMonth,setCalEvent,loggedData}) {

    /*useState 
    ---------------------*/
    //offset month state to pass down to generating this months weeks & to alter in order to cycle back through historical months.
    const [offsetMonth,setOffSetMonth] = useState(0);
    //state for holding set of arr's containing curr month's weeks.
    const [currDay,setCurrDay] = useState(null);
    const [monthArr,setMonthArr] = useState(null);

    const getCalendarMonth = () =>{
      //init arr for containing months data
      const currMonth = [];
      const currWeek = calendarUtils.getCurrentWeek(offsetMonth);

      //condition flag for if we have changed months
      let changedMonths = {historical:false,future:false};

      //push current week into currMonth array
      currMonth.push(currWeek.currWeek);

      //FOR LOOP TO FILL IN HISTORICAL WEEKS OF MONTH
      for (let i = (offsetMonth + 7); changedMonths.historical === false; i += 7) {

        //generate week data using initial offset value by 1 week (7 days) 
        const generatedWeek = calendarUtils.getCurrentWeek(i);

        //loop through current week in generatedWeek to check if month has changed from current month. if so set changedmonths flag to true 
        generatedWeek.currWeek.forEach(day => {
          //if logic flags month change as true if month is different to monthIndex in current week data.
          if(day.month !== currWeek.monthIndex) {
            changedMonths.historical = true;
            return;
          }
        });
        //unshift current generated week to full month array (so it is placed in front of current week obj)
        currMonth.unshift(generatedWeek.currWeek);
      };

      //FOR LOOP TO FILL IN FUTURE WEEKS OF MONTH
      for (let i = offsetMonth -7; changedMonths.future === false; i -= 7) {
        //generate week data using offset value 
        const generatedWeek = calendarUtils.getCurrentWeek(i);
        //loop through current week in generateWeek to check if month has changed. if so set changed months to true 
        generatedWeek.currWeek.forEach(day => {
          //if logic to flag month change as true if any of the days month is different to monthIndex in current week data. this will stop for loop
          if(day.month !== currWeek.monthIndex) {
            changedMonths.future = true;
            return;
          }
        });
        //push current generated week to full month array (so it falls behind current week obj)
        currMonth.push(generatedWeek.currWeek);
      };
      return {currMonth:currMonth,currDay:{day:currWeek.day,month:currWeek.month,year:currWeek.year}}
    };

    useEffect(()=>{
      //use getCalendarMonth function to generate all weeks of this month based off current date.
      const currMonth = getCalendarMonth(offsetMonth);
      //set state for current month
      setMonthArr(currMonth.currMonth);
      setCurrDay(currMonth.currDay);

    },[offsetMonth])

    /* eventHandler
    -----------------------*/
    const changeMonth = (plusOrMinus) => {
      if(plusOrMinus === '-') {
        setOffSetMonth(offsetMonth + 31);
      } else if(plusOrMinus === '+') {
        if(offsetMonth === 0) return;
        if(offsetMonth > 0) {
          setOffSetMonth(offsetMonth - 31);
        }
      };
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
          {monthArr.map((item)=>{
              return <CalendarWeekList currCalendar={item} setCalEvent={setCalEvent} loggedData={loggedData}/>
            })}
        </div>
      </div>}
    </>  
  )
}

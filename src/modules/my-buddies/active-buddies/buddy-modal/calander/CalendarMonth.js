import React, { useEffect, useState } from 'react'
import * as calendarUtils from './calendarUtils';
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

    const getCalendarMonth = (historical) =>{
      //init arr for containing months data
      const currMonth = [];
      const currWeek = calendarUtils.getCurrentWeek(historical,null);

      //condition flag for if we have changed months
      let changedMonths = {historical:false,future:false};

      //push current week into currMonth array
      currMonth.push(currWeek.currWeek);

      //FOR LOOP TO FILL IN HISTORICAL WEEKS OF MONTH
      for (let i = 7; changedMonths.historical === false; i += 7) {
        //generate week data using initial offset value by 1 week (7 days) 
        const generatedWeek = calendarUtils.getCurrentWeek(historical,i);

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
      for (let i = -7; changedMonths.future === false; i -= 7) {
        //generate week data using offset value 
        const generatedWeek = calendarUtils.getCurrentWeek(historical,i);
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
      return {currMonth:currMonth,currDay:{day:currWeek.day,month:currWeek.month,year:currWeek.year,monthIndex:currWeek.monthIndex,date:currWeek.date}}
    };

    useEffect(()=>{
      //use getCalendarMonth function to generate all weeks of this month based off current date.
      const currMonth = getCalendarMonth(historicalMonth);

      //set state for currMonth & currDay in relation to getCalendarMonth export
      setMonthArr(currMonth.currMonth);
      setCurrDay(currMonth.currDay);

      //if historicalMonth data is null (generating data for current month on load of calendar) set actualDate obj that doesnt change each time historicalMonth is altered.
      if(historicalMonth === null) setActualDate(currMonth.currDay);

    },[historicalMonth]);

    /* eventHandler
    -----------------------*/
    const changeMonth = (plusOrMinus) => {
      //Notes: 
        // - when state for hitorical month is changed current day is set to 15. This is to ensure that the month always is retreived based of the date if user is accessing calendar on fringe days that dont exist in other months (eg: 31 would result in error for month of Feburary) 

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
          {monthArr.map((item)=>{
              return <CalendarWeekList currCalendar={item} setCalEvent={setCalEvent} loggedData={loggedData} condMonth={currDay.monthIndex}/>
            })}
        </div>
      </div>}
    </>  
  )
}

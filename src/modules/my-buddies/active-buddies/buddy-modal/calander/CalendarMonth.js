import React, { useState } from 'react'
import * as calendarUtils from './calendarUtils';

export default function CalendarMonth({setCalendarMonth}) {

    const [offsetMonth,setOffSetMonth] = useState(0);

    const getCalendarMonth = () =>{
      //init arr for containing months data
      const currMonth = [];
      const currWeek = calendarUtils.getCurrentWeek(offsetMonth);

      //condition flag for if we have changed months
      let changedMonths = {historical:false,future:false};

      //push current week into currMonth array
      currMonth.push(currWeek);

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
        currMonth.unshift(generatedWeek);
      };

      //FOR LOOP TO FILL IN FUTURE WEEKS OF MONTH
      for (let i = offsetMonth -7; changedMonths.future === false; i -= 7) {
        //generate week data using offset value 
        const generatedWeek = calendarUtils.getCurrentWeek(i);
        console.log(generatedWeek);
        //loop through current week in generateWeek to check if month has changed. if so set changed months to true 
        generatedWeek.currWeek.forEach(day => {
          //if logic to flag month change as true if any of the days month is different to monthIndex in current week data. this will stop for loop
          if(day.month !== currWeek.monthIndex) {
            changedMonths.future = true;
            return;
          }
        });
        //push current generated week to full month array (so it falls behind current week obj)
        currMonth.push(generatedWeek);
      };

      console.log(currMonth);
    };

   getCalendarMonth(offsetMonth);
    return (
    <div className='modal-form-container calendar-month'>
        <button onClick={()=>{setCalendarMonth(false)}}>x</button>

    </div>
  )
}

export const getCurrentWeek = (epochVal,dateOffset) =>{
        //epochVal = pre set epochVal. if passed dateOffset not needed as date & week data will all be based off preset epochVal
        //dateOffSet = Numberical value in No. of days that user wants to offset the getCurrentWeek funciton by. eg: dateOffset = 7 equates to one week previous -7 equates to one week in future.    


          //days of year & months for populating calendar in DOM
          const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        //1 full day in milliseconds for offset
       const dayMilli = 86400000;
       const dateOffsetCheck = dateOffset ? dateOffset : 0

       //get current month, date, and day of the week
       //factor in offset days if user is looking back through weeks
       // init epoch value to be assigned conditionally
       let epoch ='';

       //logic to determine if set epochVal is used or auto generated.
       if(epochVal) {
        epoch = dateOffsetCheck !== 0 ? epochVal - (dateOffsetCheck*dayMilli) : epochVal
       } else if (!epoch) {
        //set epoch factoring in dateOffset No if existing.
        epoch = dateOffsetCheck !== 0 ? Date.now() - (dateOffsetCheck*dayMilli) : Date.now();
      };
  
       //create new date based off offset & following variables for month date day & year.
       const d = new Date(epoch);
       const month = months[d.getMonth()];
       const monthIndex = d.getMonth()+1 < 10 ? `0${d.getMonth() + 1}`  : (d.getMonth()+ 1).toString();
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
   
       //return current calander object with relevant weeks data
       return{
         date: date,
         day: day,
         month:month,
         monthIndex:monthIndex,
         year:year,
         currWeek:currWeekDates
       }
};

export const getCalendarMonth = (historical) =>{
  //init arr for containing months data
  const currMonth = [];
  const currWeek = getCurrentWeek(historical,null);

  //condition flag for if we have changed months
  let changedMonths = {historical:false,future:false};

  //push current week into currMonth array
  currMonth.push(currWeek.currWeek);

  //FOR LOOP TO FILL IN HISTORICAL WEEKS OF MONTH
  for (let i = 7; changedMonths.historical === false; i += 7) {
    //generate week data using initial offset value by 1 week (7 days) 
    const generatedWeek = getCurrentWeek(historical,i);

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
    const generatedWeek = getCurrentWeek(historical,i);
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
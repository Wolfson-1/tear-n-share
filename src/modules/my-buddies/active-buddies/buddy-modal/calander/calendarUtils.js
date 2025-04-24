export const getCurrentWeek = (dateOffset) =>{
      
          //days of year & months for populating calendar in DOM
          const daysOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        //1 full day in milliseconds for offset
       const dayMilli = 86400000;

       //get current month, date, and day of the week
       //factor in offset days if user is looking back through weeks
       // init epoch value to be assigned conditionally
       const epoch = dateOffset !== 0 ? Date.now() - (dateOffset*dayMilli) : Date.now();
       //create new date based off offset & following variables for month date day & year.
       const d = new Date(epoch);
       const month = months[d.getMonth()];
       const monthIndex = d.getMonth() < 10 ? `0${d.getMonth() + 1}`  : (d.getMonth()+ 1).toString();
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
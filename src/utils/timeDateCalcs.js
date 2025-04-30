// sum day & hours since last checkin to current time
export const lastCheckInSum = (prevTime,currTime) => {
    //sum checkin time & currTime to hours
    const prevInHrs = prevTime / 3600000;
    const currTimeHrs = currTime / 3600000;

    //difference between two
    const timeDiff = currTimeHrs - prevInHrs;
    const days = timeDiff / 24;
    const hours = timeDiff % 24;

    return {days: Math.floor(days),hoursRemainder: Math.floor(hours),hoursTotal: Math.floor(timeDiff), minTotal:Math.floor(timeDiff*60)};
};

export const epochtoReadable = (epoch,length) => {
      //variable for dateTime
  const dateTime = new Date(epoch);
  const time = dateTime.toTimeString();
  const date = dateTime.toDateString();

  //init returnString for assiging final readable date value to
  let returnString

  if(length === 'short') {
    returnString = `${time.slice(0,5)}, ${date.slice(8,10)} ${date.slice(4,7)}, ${date.slice(11,15)}`;
  } else if (length === 'long') {
    returnString = `${time.slice(0,5)}, ${date.slice(0,3)}, ${date.slice(8,10)} ${date.slice(4,7)}, ${date.slice(11,15)}`;
  }

  return returnString
}
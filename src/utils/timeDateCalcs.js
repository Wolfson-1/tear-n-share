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
    //formhandle to update object containing form data
    export const onChangeHandle = (e,object,setObject) => {
        if (e.target.type === 'checkbox') {
            setObject({...object,[e.target.id]: e.target.checked});
            return;
        } else {
            setObject({...object,[e.target.id]: e.target.value});
        };
    };

    // formhandle to update object containing form data outside of an onchange 
    export const addFormData = (values,object,setObject,keyValue) => {
        setObject({...object,[keyValue]: values});
        console.log(object);
    };

    //check for if a date object is ahead of the current date.
    export const confDateNotFuture = (inputDate) => {
        //init variable to confirm if date is in future or no
        let inFuture = false; 

        //get current date and format it to the same as a calander form input
        const date = new Date();
        const currDateObj = {day: date.getDate() > 10 ? date.getDate() : Number(`0${date.getDate()}`),
                       month: date.getMonth() > 10 ? date.getMonth()+1 : Number(`0${date.getMonth()+1}`),
                       year: date.getFullYear()}
        //split out input date from form into year, month, date whilst converting each to number
        const inputDateArr = inputDate.split('-').map((item)=>{
            return Number(item);
        });
    
        //logic to cycle through year, month & day, if any in future compared to curr date. set inFuture true & return.
        if(currDateObj.year < inputDateArr[0]) {
            // if year in future
            inFuture = true;
            return inFuture;
        } else if (currDateObj.month < inputDateArr[1]) {
            // if month in future
            inFuture = true;
            return inFuture;
        } else if (currDateObj.day < inputDateArr[2]) {
            // if day in future
            inFuture = true;
            return inFuture;
        }

        // all checks passed. return inFuture as false
        return inFuture
    }

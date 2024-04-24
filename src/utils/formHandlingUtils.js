    //formhandle to update object containing form data
    export const onChangeHandle = (e,object,setObject,keyValue) => {
        // if value is checkbox use checked instead of value
        if (e.target.type === 'checkbox') {
            setObject({...object,[keyValue]: e.target.checked});
            console.log(object);
            return;
        } else {
            setObject({...object,[keyValue]: e.target.value});
            console.log(object);
        };
    };

    // function to update object containing form data outside of an onchange 
    export const addFormData = (values,object,setObject,keyValue) => {
        setObject({...object,[keyValue]: values});
        console.log(object);
    };

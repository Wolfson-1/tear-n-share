    //formhandle to update object containing form data
    export const onChangeHandle = (e,object,setObject) => {
        if (e.target.type === 'checkbox') {
            setObject({...object,[e.target.id]: e.target.checked});
            return;
        } else {
            setObject({...object,[e.target.id]: e.target.value});
        };
    };

    // function to update object containing form data outside of an onchange 
    export const addFormData = (values,object,setObject,keyValue) => {
        setObject({...object,[keyValue]: values});
        console.log(object);
    };

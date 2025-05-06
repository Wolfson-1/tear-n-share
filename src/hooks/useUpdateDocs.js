import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";

export default function useUpdateDocs(updateObj,database,path,ids) {
    //instructions on use
    //update Obj must be in obj form for what needs updating
    // path must be set in an array
    //ids must be in an arr
    
    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);
 
    //useEffect to run update whenever updateObj changes
    useEffect(() => {

        //set isComplete back to to false if true from a previous run
        if(isComplete === true) setIsComplete(false);
        //check to make sure updateObj is not blank or no ids have been provided
        if(!updateObj || updateObj === null || !ids || ids.length === 0) {
            return;
        }

        const updateFunction = async () => {
            for (let i = 0; i < ids.length; i++) {
                //set doc ref based on path and looping through Id's
                const docRef = doc(database,...path,ids[i]);
            
                if (docRef) {
                await updateDoc(docRef, {
                    ...updateObj
                });
            }
            }
            //set isComplete to true for use as feedback from function for completion
            setIsComplete(true);
        };

        //execute update function
        updateFunction();

    },[updateObj,ids])
    return {isComplete};
};
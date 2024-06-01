import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";

export default function useUpdateDoc(updateObj,database,path) {

    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        //set isComplete back to to false if true from a previous run
        if(isComplete === true) setIsComplete(false);
        //if updateObj is blank
        if(!updateObj || updateObj === null) return;

        const updateFunction = async () => {
            const docRef = doc(database,...path);

            await updateDoc(docRef, {
                ...updateObj
              });

              //set isComplete to true for use as feedback from function for completion
              setIsComplete(true);
        }
        updateFunction();

    },[updateObj])
    return {isComplete};
};
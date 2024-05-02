import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";

export default function useUpdateDoc(updateObj,database,path) {

    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if(!updateObj || updateObj === null) return;

        const updateFunction = async () => {
            
            const docRef = doc(database,...path);

            await updateDoc(docRef, {
                ...updateObj
              });

              setIsComplete(true);
        }
        updateFunction();

    },[updateObj])
    return {isComplete};
};
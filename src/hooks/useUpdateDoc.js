import { useState, useEffect } from 'react';
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function useUpdateDoc(updateObj,database,path,filter) {
    //instructions on use
    //update Obj must be in obj form
    // path must be set in an array
    //if using filter set this in array as following order [field name,operator,qualifier] eg : ['fruit', '==','Apples']

    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);


    //useEffect to run update whenever updateObj changes
    useEffect(() => {
        //set isComplete back to to false if true from a previous run
        if(isComplete === true) setIsComplete(false);
        //if updateObj is blank
        if(!updateObj || updateObj === null) return;

        const updateFunction = async () => {
            //if filter exists update doc based of queried collection reference
            if (filter) {
                //variable for filtered ID's
                let filteredIds = [];

                //query based on filter parameters
                const q = query(collection(database,...path), where(...filter));
                //retreive doc based on query
                const querySnapshot = await getDocs(q);

                //push Id's into filteredId's array ready for update
                querySnapshot.forEach((doc) => {
                    filteredIds.push(doc.id);
                    })

                //loop through filtered Id's to update
                for (let i = 0; i < filteredIds.length; i++) {
                    const docRef = doc(database,...path,filteredIds[i])
                    await updateDoc(docRef, {
                        ...updateObj
                    })                        
                };

            //if filter doesnt exist fetch doc to be updated using document path only
            } else if(!filter) {
                const docRef = doc(database,...path);
                await updateDoc(docRef, {
                    ...updateObj
                });

                //set isComplete to true for use as feedback from function for completion
                setIsComplete(true);
            } 
        };

        //execute update function
        updateFunction();

    },[updateObj])
    return {isComplete};
};
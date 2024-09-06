import { useEffect, useState } from 'react'
import { serverTimestamp, addDoc, collection, setDoc, doc } from 'firebase/firestore';

export default function useAddSubDoc(uploadObj,subObj,database,path,subCollection,id,subId) {    
    
    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
            const uploadData = async () => {
                //return if object or sub object do not exist.
                if (!uploadObj || !subObj) return;     


                //conditional logic to set specific Id if exists
                if(id && subId) {
                    const docRef = await setDoc(doc(database,...path,id), {
                        ...uploadObj,
                        createdAt: serverTimestamp()
                    })    

                    //after initial doc is create, set sub collection & document object
                    const subDocRef = await setDoc(doc(database,...path,id,subCollection,subId), {
                        ...subObj,
                        createdAt: serverTimestamp()
                        });
                } else if (!id && !subId) {
                    const docRef = await addDoc(collection(database,...path), {
                        ...uploadObj,
                        createdAt: serverTimestamp()
                    })

                    //after initial doc is create, set sub collection & document object
                    const subDocRef = await addDoc(collection(database,...path,docRef.id,subCollection), {
                        ...subObj,
                        createdAt: serverTimestamp()
                    });
                }
                
            // Set is complete to true
            setIsComplete(true);
            }
            // call upload data function
            uploadData();
        },[uploadObj,subObj]);

        return {isComplete}
    };
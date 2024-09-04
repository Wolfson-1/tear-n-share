import { useEffect, useState } from 'react'
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';

export default function useAddSubDoc(uploadObj,subObj,database,path,subCollection) {
    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
            const uploadData = async () => {
                console.log('upload triggered')
                console.log(uploadObj);
                console.log(subObj);
                //return if object or sub object do not exist.
                if (!uploadObj || !subObj) return;                 
                
                console.log('running');
                console.log(uploadObj);
                console.log(subObj);
                const docRef = await addDoc(collection(database,...path), {
                    ...uploadObj,
                    createdAt: serverTimestamp()
                })
                
                const subDocRef = await addDoc(collection(database,...path,docRef.id,subCollection), {
                    ...subObj,
                    createdAt: serverTimestamp()
                    });
                
            // Set is complete to true
            setIsComplete(true);
            }
            // call upload data function
            uploadData();
        },[uploadObj,subObj]);

        return {isComplete}
    };
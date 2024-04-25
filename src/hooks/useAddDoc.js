import { useEffect, useState } from 'react'
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';

export default function useAddDoc(uploadObjs,database,path) {
    // upload objects must be an array of objects.

    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);
    const [docIdArr,setDocIdArr] = useState([]);

    useEffect(() => {
            const uploadData = async () => {
                //return if no objects are found
                if (!uploadObjs || uploadObjs.length === 0) return;
                
                // Initialize array for docIds
                let docIds = [];
                //loop through array of objects to upload
                for (let i = 0; i < uploadObjs.length; i++) {
                    // add obj to collection
                    const docRef = await addDoc(collection(database,...path), {
                    ...uploadObjs[i],
                    createdAt: serverTimestamp()
                });
                docIds.push(docRef.id);
                }
            // Set is complete to true & doc Id arr
            setIsComplete(true);
            setDocIdArr(docIds);
            }
            // call upload data function
            uploadData();
        },[uploadObjs]);

        return {isComplete,docIdArr}
    };
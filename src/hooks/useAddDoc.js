import { useEffect, useState } from 'react'
import { serverTimestamp, setDoc, doc, addDoc, collection } from 'firebase/firestore';

export default function useAddDoc(uploadObjs,database,path,id) {
    // NOTE FOR USE: upload object(s) must be an array.

    //  isComplete process complete check
    const [isComplete, setIsComplete] = useState(false);
    const [docIdArr,setDocIdArr] = useState([]);
    
    useEffect(() => {
            const uploadData = async () => {
                //return if no objects are found
                if (!uploadObjs || uploadObjs.length === 0) return;
                console.log(uploadObjs);
                
                // Initialize doc ref & array for docIds
                let docRef
                let docIds = [];
                //loop through array of objects to upload
                for (let i = 0; i < uploadObjs.length; i++) {
                    // add obj to collection
                    if(id) {
                        docRef = await setDoc(doc(database,...path, id), {
                            ...uploadObjs[i],
                            createdAt: serverTimestamp()
                        });                        
                    } else if(!id) {
                        docRef = await addDoc(collection(database,...path), {
                            ...uploadObjs[i],
                            createdAt: serverTimestamp()
                        });
                    }

                docIds.push(id ? id : docRef.id);
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
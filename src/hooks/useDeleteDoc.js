import { useEffect } from 'react'
import { deleteDoc, doc } from 'firebase/firestore';

export default function useDeleteDoc(documentIds,database,docPath) {
    //how to: 
        //database = firebase/firestore database targeted
        //docPath = path is the pathway to document being deleted
        //document = the document id's to be deleted (needs to be in array for deletion even if only 1 doc)
        
    useEffect(() => {
        const deleteDocument = async () => {
            //conditional to check if doc to delete exists.
            if(!documentIds || documentIds.length === 0) return;
            
            console.log('running delete')
            for (let i = 0; i < documentIds.length; i++) {
                //Delete refference in firebase database
                await deleteDoc(doc(database,...docPath,documentIds[i]));
            };
            
        };
        deleteDocument();
    },[documentIds]);
}

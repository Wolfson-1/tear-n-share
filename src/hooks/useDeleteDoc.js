import { useEffect } from 'react'
import {storage} from '../firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export default function useDeleteDoc(document,database,docPath,imgName,imgPath) {
    //how to: 
        //database = firebase/firestore database targeted
        //docPath = path is the pathway to document being deleted
        //document = the document to be deleted
        //imgName = key value pair name of img to be deleted if there is one to be deleted exists.
        //imgPath = Pathway in folder storage if required. "/" needed after path for continuation to file location.

    useEffect(() => {
        const deleteDocument = async () => {
            //conditional to check if doc to delete exists.
            if(!document || document === null) return;

            // check if there is an img to delete
            if(document[imgName]) {
                // img ref from firebase storage 
                const desertRef = ref(storage,`${imgPath ? imgPath : null}` + document[`${imgName}`]);

                // Delete the file
                deleteObject(desertRef).then(() => {
                    console.log('img deleted');
                }).catch((error) => {
                    console.log('Ran into error on delete')
                    console.log(error);
                });
            }
            //Delete refference in firebase database
            await deleteDoc(doc(database,...docPath,document.id));
        };
        deleteDocument();
    },[document]);
}

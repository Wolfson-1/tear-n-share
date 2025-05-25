import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function useCollectionCount(database,path,filter) {
    // NOTE FOR USE: path and filter must be in an array
    // Filter arr structure example ['key','operator','parameter']. eg: ['active', '==', 'true']
    
    //state for value of colleciton count
    const [count,setCount] = useState(undefined);

    useEffect(() => {
        //init query
        let q
        //logic to take into account a collection query filter if exists 
        if(filter) {
            q = query(collection(database,...path), where(...filter));
        } else if (!filter) { 
            q = query(collection(database,...path));
        };

        //get snapshot for count of collection from server
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCount(snapshot.size);
            });
        
            //cleanup
        return () => unsubscribe();
    },[]);

return count;
};

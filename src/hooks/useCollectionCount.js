import { useEffect, useState } from 'react'
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export default function useCollectionCount(database,path,filter) {
    // NOTE FOR USE: path and filter must be in an array
    // Filter arr structure example ['key','operator','parameter']. eg: ['active', '==', 'true']
    
    //state for value of colleciton count
    const [count,setCount] = useState(undefined);

    useEffect(() => {
        //creat function to fetch count asynchronously
        const fetchCount = async () => {
            
            try{
                //set collection using database & path 
            const coll = collection(database,...path);

            //logic to take into account a collection query filter if exists 
            if(filter) {
                const q = query(coll, where(...filter));
                const snapshot = await getCountFromServer(q);
                //set count
                setCount(snapshot.data().count);
            } else if (!filter) {
                //get snapshot for count of collection from server
                const snapshot = await getCountFromServer(coll);
                //set count
                setCount(snapshot.data().count);
            };
            } catch(error) {
                console.error("Error fetching collection count:", error);
                setCount(0);
            }
            
        };

        //run function
        fetchCount();
    },[]);

return count;
};

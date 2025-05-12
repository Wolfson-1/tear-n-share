import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';

export default function useFetchDocsFilter(database,path,filter,filterParam) {
  //NOTES FOR USE
  // path needs to be in its own array. 
  // docs are fetched on load or on change of filterParamaters

  const [dataExport, setData] = useState(null);

  useEffect(() => {

    if (!filter || filterParam === undefined) {
      return;
    } 

    let q = query(collection(database, ...path), where(filter, '==', filterParam));
    
    const unsubscribe = onSnapshot(q, (collection) => {
      const filteredData = collection.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(filteredData.length > 0 ? filteredData : []);
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    // cleanup
    return () => {
      unsubscribe();
      setData(null);
    }
  },[filterParam]);

  // return data
  return dataExport;
};
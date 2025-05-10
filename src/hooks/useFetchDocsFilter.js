import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';

export default function useFetchDocsFilter(database,path,filter,filterParam) {
  //NOTES FOR USE
  // path needs to be in its own array. 
  // docs are fetched on load or on change of filterParamaters

  const [dataExport, setData] = useState(null);

  useEffect(() => {

  const getData = async () => {
    console.log(filterParam);
    if (!filter || filterParam === undefined) return;
    
    try {
      // fetch data using get docs
      let q = query(collection(database, ...path), where(filter, '==', filterParam));
      const data = onSnapshot(q, (collection) => {
        const filteredData = collection.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // set data to new filtered data
        console.log(filteredData);
        if(filteredData) setData(filteredData);
        if(!filteredData) setData([]);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

    // run get data function
    getData();

    // cleanup
    return () => {
      setData(null);
    }
  },[filterParam]);

  // return data
  return dataExport;
};
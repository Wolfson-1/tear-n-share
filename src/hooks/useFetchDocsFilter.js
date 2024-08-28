import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';

export default function useFetchDocsFilter(database,path,filter,filterParam) {
  //NOTES FOR USE
  // path needs to be in its own array. 

  const [dataExport, setData] = useState([]);

  useEffect(() => {

  const getData = async () => {
    //clear previous data
    setData([]);
    
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
        setData(filteredData);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

    // run get data function
    getData();

    // cleanup
    return () => {
      setData([]);
    }
  },[filterParam]);

  // return data only when it's available
  return dataExport.length > 0 ? dataExport : null;
};
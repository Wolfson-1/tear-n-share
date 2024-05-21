import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';

export default function useFetchDocsFilter(database,path,filter,filterParam) {
  //NOTES FOR USE
  // path & order need to be in their own arrays. 
  // format for order arr: ['variable','desc']

  const [dataExport, setData] = useState([]);

  useEffect(() => {
  const getData = async () => {
    try {
      // fetch data using get docs
      const q = query(collection(database, ...path), where(filter, '==', filterParam));
      const data = onSnapshot(q, (collection) => {
        const filteredData = collection.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // set data to new filtered data
        setData(filteredData);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log(dataExport);
  }

    // run get data function
    getData();
  },[filterParam]);

  // return data only when it's available
  return dataExport.length > 0 ? dataExport : null;
};
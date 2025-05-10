import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function useFetchDocs(database,path,order) {
  //NOTES FOR USE
  // path & order need to be in their own arrays. 
  // format for order arr: ['variable','desc']. For default fetch use: ['createdAt']

  const [dataExport, setData] = useState(null);

  useEffect(() => {
  const getData = async () => {
    try {
      // fetch data using get docs
      const q = query(collection(database, ...path), orderBy(...order));
      const data = onSnapshot(q, (collection) => {
        const filteredData = collection.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // set data to new filtered data. if it doesnt exist, set to null
        if(filteredData) setData(filteredData);
        if(!filteredData) setData([]);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

    // run get data function
    getData();
  }, []);

  // return data
  return dataExport;
};
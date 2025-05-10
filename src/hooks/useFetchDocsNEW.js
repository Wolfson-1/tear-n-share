import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function useFetchDocs(database,path,order) {
  //NOTES FOR USE
  // path & order need to be in their own arrays. 
  // format for order arr: ['variable','desc']. For default fetch use: ['createdAt']

  const [dataExport, setData] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    //qualify passed down parameters to make sure appropriate for loading
    if(!database || !path || !order) {
      console.error('parameter missing');
      return
    };

    if(Array.isArray(path) === false || Array.isArray(order) === false) {
      console.error('arr parameter not in arr format')
      return
    };

    try {
      //set is loading to true to show data is fetching
      setIsLoading(true);
      // fetch data using get docs
      const q = query(collection(database, ...path), orderBy(...order));
      const data = onSnapshot(q, (collection) => {
        const filteredData = collection.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // set data to new filtered data
        setData(filteredData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // return data only if available
  return dataExport.length > 0 ? {data:dataExport, loading:isLoading} : {data:null,loading:isLoading};
};
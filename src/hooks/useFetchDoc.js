import { useEffect, useState } from 'react'
import { doc,onSnapshot } from 'firebase/firestore';

export default function useFetchDoc(database, path) {
  const [dataExport, setData] = useState(null);

  useEffect(() => {
    //get data function to pull in doc from database based on path info
    const getData = async () => {
      try {
        const data = onSnapshot(doc(database, ...path), (doc) => {
          const filteredData = {...doc.data(), id: doc.id};
          setData(filteredData);
      });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    //Conditional logic. If last item in path is null, return to avoid error in attempt to fetch data
    if(!path[path.length-1] || path[path.length-1] === null) return;

    getData();
  }, []);
  
  return dataExport;
};
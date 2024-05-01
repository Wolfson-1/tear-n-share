import React, { useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore';

export default function useFetchDoc(database, path) {
  const [dataExport, setData] = useState(null);

  useEffect(() => {
    //get data function to pull in doc from database based on path info
    const getData = async () => {
      try {
        const docRef = doc(database, ...path);
        console.log('fetching doc');
        const data = await getDoc(docRef);
        const filteredData = { ...data.data(), id: data.id };
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    console.log(path.length)
    console.log(path[path.length-1]);
    //Conditional logic. If last item in path is null, return to avoid error in attempt to fetch data
    if(!path[path.length-1] || path[path.length-1] === null) return;

    getData();
  }, []);
  
  return dataExport;
};
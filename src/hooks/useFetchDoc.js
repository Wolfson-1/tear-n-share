import React, { useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore';

export default function useFetchDoc(database, path) {
  const [dataExport, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(database, ...path);
        const data = await getDoc(docRef);
        const filteredData = { ...data.data(), id: data.id };
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);
  
  return dataExport;
};
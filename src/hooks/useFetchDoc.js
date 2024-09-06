import { useEffect, useState } from 'react'
import { doc,onSnapshot } from 'firebase/firestore';

export default function useFetchDoc(database, path, id) {
  //last id outside of path array to make easier for it to be dynamic
  
  const [dataExport, setData] = useState(undefined);

  useEffect(() => {
    //get data function to pull in doc from database based on path info
    const getData = () => {

      //conditional to return out of function if id does not exist
      if(!id || id === null) return;

      try {
        const data = onSnapshot(doc(database, ...path, id), (doc) => {
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
  }, [id]);
  
  return dataExport;
};
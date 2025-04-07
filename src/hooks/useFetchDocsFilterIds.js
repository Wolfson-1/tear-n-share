import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

export default function useFetchDocsFilters(database,path,filterIds) {
  //NOTES FOR USE
  // To fetch multiple docs from a collection in accordance with a set of ID's. 
  // Will run on change of filterParam variable
  // For use when there should be only one match per filter
  // path & filterParam needs to be in its own array. 

  const [dataExport, setDataExport] = useState([]);

  useEffect(() => {

  const getData = async () => {
    //check for if filterIds param is null or empty. If so return
    if(filterIds === null || filterIds === undefined || filterIds.length === 0) return;

    //clear any previous data & init temporary arr to pulled docs to
    setDataExport([]);
    let dataArr = []
    
    filterIds.forEach(id => {
        try {
            // fetch data using get docs
            const data = onSnapshot(doc(database, ...path, id), (doc) => {
              const filteredData = {...doc.data(), id: doc.id};
              dataArr.push(filteredData);
            });
          } catch (error) {
            console.error('Error fetching data:', error);
          }        
    });
    console.log(dataArr);
    setDataExport(dataArr);
  };

    // run get data function
    getData();

    // cleanup
    return () => {
      setDataExport([]);
    }
  },[filterIds]);

  // return data only when it's available
  return dataExport.length > 0 ? dataExport : null;
};
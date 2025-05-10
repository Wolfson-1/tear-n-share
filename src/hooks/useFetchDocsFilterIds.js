import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

export default function useFetchDocsFilterIds(database, path, filterIds) {
  const [dataExport, setDataExport] = useState(null);

  useEffect(() => {
    if (!filterIds || filterIds.length === 0) return;

    const tempData = [];
    let isMounted = true;

    filterIds.forEach((id, index) => {
      const unsub = onSnapshot(doc(database, ...path, id), (docSnap) => {
        if (!docSnap.exists()) return;

        const docData = { ...docSnap.data(), id: docSnap.id };
        tempData[index] = docData;

        //set data if it meets length of filterIds length 
        if (tempData.filter(Boolean).length === filterIds.length && isMounted) {
          setDataExport([...tempData]);
        } else {
          setDataExport([]);
        }
    });
    });

    return () => {
      isMounted = false;
      setDataExport(null);
    };
  }, [filterIds]);

  return dataExport;
};
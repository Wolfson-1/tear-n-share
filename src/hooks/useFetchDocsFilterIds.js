import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

export default function useFetchDocsFilterIds(database, path, filterIds) {
  const [dataExport, setDataExport] = useState([]);

  useEffect(() => {
    if (!filterIds || filterIds.length === 0) return;

    const unsubscribes = [];
    const tempData = [];
    let receivedCount = 0;
    let isMounted = true;

    // Clear old data
    setDataExport([]);

    filterIds.forEach((id, index) => {
      const unsub = onSnapshot(doc(database, ...path, id), (docSnap) => {
        if (!docSnap.exists()) return;

        const docData = { ...docSnap.data(), id: docSnap.id };
        tempData[index] = docData; // store in original order
        receivedCount++;

        //of logic to check if
        if (isMounted && receivedCount === filterIds.length) {
          // All docs have been received at least once
          setDataExport(tempData.filter(Boolean)); // filter in case of missing docs
        }
      });

      unsubscribes.push(unsub);
    });

    return () => {
      isMounted = false;
      unsubscribes.forEach(unsub => unsub());
      setDataExport([]);
    };
  }, [filterIds]);

  return dataExport.length > 0 ? dataExport : null;
};
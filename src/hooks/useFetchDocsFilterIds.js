import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

export default function useFetchDocsFilterIds(database, path, filterIds) {
  const [dataExport, setDataExport] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {


    if (!filterIds) {
      return;
    } else if (filterIds.length === 0) {
      setDataExport([]);
      return;
    }

    const tempData = new Array(filterIds.length);
    const unsubscribes = [];

    setError(null);

    filterIds.forEach((id, index) => {
      try {
        const unsubscribe = onSnapshot(
          doc(database, ...path, id),
          (docSnap) => {
            if (!docSnap.exists()) {
              tempData[index] = null;
              return;
            }

            tempData[index] = { ...docSnap.data(), id: docSnap.id };

            if (tempData) {
              setDataExport([...tempData]);
            } else {
              console.log('setting empty arr')
              setDataExport([]);
            }
          },
          (err) => {
            console.error(`Snapshot error for ID ${id}:`, err);
              setError(err.message || 'Unknown error');
          }
        );

        unsubscribes.push(unsubscribe);
      } catch (err) {
        console.error(`Setup error for ID ${id}:`, err);
          setError(err.message || 'Unknown error during setup');
      }
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
      setDataExport(null);
    }; 
  }, [filterIds]);

  return dataExport;
};
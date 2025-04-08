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
        tempData[index] = docData;

        if (isMounted) {
          setDataExport(prev => {
            const updated = [...tempData];
            return updated.filter(Boolean); // keep only non-null
          });
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
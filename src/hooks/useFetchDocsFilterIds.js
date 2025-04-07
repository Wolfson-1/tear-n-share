import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

export default function useFetchDocsFilterIds(database, path, filterIds) {
  const [dataExport, setDataExport] = useState([]);

  useEffect(() => {
    if (!filterIds || filterIds.length === 0) return;

    let isMounted = true;
    const unsubscribes = [];
    const dataMap = {};

    filterIds.forEach(id => {
      const unsub = onSnapshot(doc(database, ...path, id), (docSnap) => {
        if (!docSnap.exists()) return;

        dataMap[docSnap.id] = { ...docSnap.data(), id: docSnap.id };
        if (isMounted) {
          console.log(dataMap);
          setDataExport(Object.values(dataMap))
        };
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
}
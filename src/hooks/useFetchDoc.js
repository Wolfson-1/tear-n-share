import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

export default function useFetchDoc(database, path, id) {
  const [dataExport, setData] = useState(undefined);

  useEffect(() => {
    // Guard clause to prevent subscribing if id or path is invalid
    if (!id || id === null || !path) {
      setData(undefined);
      return;
    }

    const docRef = doc(database, ...path, id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData({ ...docSnap.data(), id: docSnap.id });
      } else {
        setData(null); // Handle case where document doesn't exist
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    // Cleanup function to unsubscribe on unmount or id/path change
    return () => unsubscribe();
  }, [id]);

  return dataExport;
}
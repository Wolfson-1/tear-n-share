import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const useAuthUserCheck = (displayName, setUser) => {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          loggedIn: true,
          userUid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      } else {
        setUser({ loggedIn: false, email: '', displayName: '' });
      }
    });

    return () => unsubscribe();
  }, []);

    // Respond to changes in userData.displayName
    useEffect(() => {
        if(!displayName) return;
        const user = auth.currentUser
    
        if(user.displayName !== displayName) {
            setUser((prev) => ({
                ...prev,
            displayName: displayName,
            }));
        }
      }, [displayName]);
};

export default useAuthUserCheck;
import {auth} from '../firebase/config';
import {onAuthStateChanged} from 'firebase/auth';

const authUserCheck = (setUser) => {
    
    const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser({loggedIn:true, userUid: user.uid, email:user.email, displayName:user.displayName});
        } else {
            setUser({loggedIn:false,email:'', displayName:''});
        }
        });

    return () => {
        listen();
    }
};

export default authUserCheck;
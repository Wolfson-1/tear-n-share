import {auth} from '../firebase/config';
import {onAuthStateChanged} from 'firebase/auth';

const authUserCheck = (setUser) => {
    
    const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser({loggedIn:true,email:user.email});
        } else {
            setUser({loggedIn:false,email:''});
        }
        });

    return () => {
        listen();
    }
};

export default authUserCheck;
import {auth} from '../firebase/config';
import { signOut } from 'firebase/auth';

const userSignOut = () => {
    //firebase sign out user
    signOut(auth).then(() => {
        console.log("userSigned out");
    }).catch(error => console.log(error));

    //remove any local storage for signed out user
    localStorage.clear();
};

export default userSignOut;
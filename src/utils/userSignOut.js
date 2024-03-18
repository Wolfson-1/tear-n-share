import {auth} from '../firebase/config';
import { signOut } from 'firebase/auth';

const userSignOut = () => {
    signOut(auth).then(() => {
        console.log("userSigned out");
    }).catch(error => console.log(error));
};

export default userSignOut;
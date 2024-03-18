import { createContext } from 'react';

export let ContextUser = createContext({loggedIn:false, user:'', email:''});
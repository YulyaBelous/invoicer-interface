import {createContext} from "react";

const AuthContext = createContext({
    user: null,
    IsAuth: null,
    isAdmin: null,
    isSupplier: null,
    isCustomer: null,
    isActivated: null,
    logIn: () => {},
    logOut: () => {}});

export default AuthContext;
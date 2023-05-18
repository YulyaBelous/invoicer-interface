import {createContext} from "react";

const AuthContext = createContext({user: null, IsAuth: null, isAdmin: null, logIn: () => {}, logOut: () => {}});

export default AuthContext;
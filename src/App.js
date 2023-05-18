import {useEffect, useState} from "react";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";

import useUserService from "./services/user-service";
import AuthVerify from "./services/auth-verify";
import AuthContext from "./context/auth-context";

import Header from "./shared/layout/header/header";
import Home from "./shared/layout/home/home";
import Invoice from "./entities/invoice/invoice";
import Supplier from "./entities/supplier/supplier";
import Customer from "./entities/customer/customer";
import Address from "./entities/address/address";
import BankAccount from "./entities/bank-account/bank-account";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ModalSessionTimeout from "./shared/layout/modal-session-timeout";
import Users from "./entities/users/users";

function App() {

    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    const {logout} = useUserService();

    const logOut = () => {
        logout();
        setIsAuth(false);
        setIsAdmin(false);
        setUser(JSON.parse(localStorage.getItem("user")));
    }
    const logIn = () => {
        setUser(JSON.parse(localStorage.getItem("user")));
        setIsAuth(true);
    }

    useEffect(() => {
        if (user && user.accessToken) {
            setIsAuth(true);
            user.authorities.map((authority) => {
                if(authority === "ROLE_ADMIN") {
                    setIsAdmin(true);
                }
            })
        }
    }, [isAuth])

    return (
        <Router>
            <AuthContext.Provider value={{user, isAuth, isAdmin, logIn, logOut}}>
                <Header/>
                {isAuth? <ModalSessionTimeout/> : null}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/invoice" element={<Invoice/>}/>
                    <Route path="/supplier" element={<Supplier/>}/>
                    <Route path="/customer" element={<Customer/>}/>
                    <Route path="/address" element={<Address/>}/>
                    <Route path="/bank-account" element={<BankAccount/>}/>
                    <Route path="/users" element={<Users/>}/>
                </Routes>
                <AuthVerify/>
            </AuthContext.Provider>
        </Router>
    );
    }

export default App;

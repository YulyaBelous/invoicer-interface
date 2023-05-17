import {Route, Routes, BrowserRouter as Router} from "react-router-dom";

import AuthVerify from "./services/auth-verify";
import useUserService from "./services/user-service";

import Header from "./shared/layout/header/header";
import Home from "./shared/layout/home/home";
import Invoice from "./entities/invoice/invoice";
import Supplier from "./entities/supplier/supplier";
import Customer from "./entities/customer/customer";
import Address from "./entities/address/address";
import BankAccount from "./entities/bank-account/bank-account";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

    const {logout} = useUserService();

    const user = JSON.parse(localStorage.getItem("user"));

    const logOut = () => {
        logout();
    }

    return (
        <Router>
          <Header user = {user}/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/invoice" element={<Invoice/>}/>
                <Route path="/supplier" element={<Supplier/>}/>
                <Route path="/customer" element={<Customer/>}/>
                <Route path="/address" element={<Address/>}/>
                <Route path="/bank-account" element={<BankAccount/>}/>
            </Routes>
            <AuthVerify logOut={logOut}/>
        </Router>
    );
    }

export default App;

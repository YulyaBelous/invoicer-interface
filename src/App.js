import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./shared/layout/header/header";

import './App.css';
import Invoice from "./entities/invoice/invoice";
import Supplier from "./entities/supplier/supplier";
import Customer from "./entities/customer/customer";
import Address from "./entities/address/address";
import BankAccount from "./entities/bank-account/bank-account";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <Router>
      <Header/>
        <Routes>
            <Route path="/invoice" element={<Invoice/>}/>
            <Route path="/supplier" element={<Supplier/>}/>
            <Route path="/customer" element={<Customer/>}/>
            <Route path="/address" element={<Address/>}/>
            <Route path="/bank-account" element={<BankAccount/>}/>
        </Routes>
    </Router>
  );
}

export default App;

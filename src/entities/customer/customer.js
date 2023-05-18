import React, {useState, useEffect, useContext} from "react";

import {Button, Container, Table, Card, Dropdown, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateCustomer} from "./customer-create-or-update";
import ViewAddress from "../address/address-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";
import {NavLink} from "react-router-dom";
import ViewArrowSort from "../../shared/layout/view/view-arrow-sort";
import AuthContext from "../../context/auth-context";

const Customer = () => {

    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('customers', setCustomers, currentPage, user.username).then(value => {
            setPageable(value);
        });
        getEntities('invoices', setInvoices, currentPage, user.username);
        getEntities('addresses', setAddresses, currentPage, user.username);
        getEntities('bank-accounts', setBankAccounts, currentPage, user.username);
    }, []);

    const createCustomer = async (customer) => {
        await createEntity('customers', customer, setCustomers, currentPage, user.username);
    }

    const updateCustomer = async (customer, id) => {
        await updateEntity('customers', customer, setCustomers, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('customers', setCustomers, currentPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('customers', setCustomers, currentPage, user.username, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const viewAllList = (list, name, title) => {
        const listFiltered = list.filter(item => item.customer? item.customer.name === name : null);
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">{title}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {listFiltered? listFiltered.map((item, i) => (
                        <Dropdown.Item key={i} >{item.city? <ViewAddress address={item}/> : (item.id)}</Dropdown.Item>
                    )): null}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    const RenderCustomer = () => {
        return(
            <Container fluid>
                <CreateOrUpdateCustomer createCustomer={createCustomer} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id <NavLink onClick={() => sort("id")}> <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Name <NavLink onClick={() => sort("name")}> <ViewArrowSort sortParam="name" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Short name <NavLink onClick={() => sort("shortName")}> <ViewArrowSort sortParam="shortName" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Full name <NavLink onClick={() => sort("fullName")}> <ViewArrowSort sortParam="fullName" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Tax code <NavLink onClick={() => sort("taxCode")}> <ViewArrowSort sortParam="taxCode" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Invoices</th>
                        <th>Addresses</th>
                        <th>Bank accounts</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer, i) => (
                        <tr key={`entity-${i}`}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.shortName}</td>
                            <td>{customer.fullName}</td>
                            <td>{customer.taxCode}</td>
                            <td>{viewAllList(invoices, customer.name, 'Invoices')}</td>
                            <td>{viewAllList(addresses, customer.name, 'Addresses')}</td>
                            <td>{viewAllList(bankAccounts, customer.name, 'Bank Accounts')}</td>
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                        <CreateOrUpdateCustomer updateCustomer={updateCustomer}  customer={customer} isNew={false}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button
                                            onClick={() => deleteEntity('customers', customer.id, setCustomers, currentPage, user.username)} variant="danger"><Trash3Fill/></Button>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Pageable pageable={pageable} setPage={setPage}/>
            </Container>
        )
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <h2 style={{textAlign: "left"}}>Customers</h2>
                {loading? <Loading/> : <RenderCustomer/>}
            </Card.Body>
        </Card>
    );
}

export default Customer;
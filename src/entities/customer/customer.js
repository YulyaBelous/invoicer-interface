import React, {useState, useEffect} from "react";

import {Button, Container, Table, Card, Dropdown, Col, Row} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../entities-service";
import {CreateOrUpdateCustomer} from "./customer-create-or-update";
import ViewAddress from "../address/address-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";

const Customer = () => {

    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('customers', setCustomers, currentPage).then(value => {
            setPageable(value);
        });
        getEntities('invoices', setInvoices);
        getEntities('addresses', setAddresses);
        getEntities('bank-accounts', setBankAccounts);
    }, []);

    const createCustomer = async (customer) => {
        await createEntity('customers', customer, setCustomers, currentPage);
    }

    const updateCustomer = async (customer, id) => {
        await updateEntity('customers', customer, setCustomers, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('customers', setCustomers, currentPage).then(value => {
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
                        <th>Id</th>
                        <th>Name</th>
                        <th>Short name</th>
                        <th>Full name</th>
                        <th>Tax code</th>
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
                                    <Col style={{paddingRight: 3, paddingLeft: 3}}>
                                        <Button variant="secondary"><FiletypePdf/></Button>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button
                                            onClick={() => deleteEntity('customers', customer.id, setCustomers, currentPage)} variant="danger"><Trash3Fill/></Button>
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
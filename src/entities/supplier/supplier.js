import {Button, Container, Table, Card, Dropdown, Col, Row} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";
import React, {useState, useEffect} from "react";
import useEntitiesService from "../entities-service";
import CreateOrUpdateSupplier from "./supplier-create-or-update";
import ViewAddress from "../address/address-view";
import {CreateOrUpdateInvoice} from "../invoice/invoice-create-or-update";

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [addresses, setAddress] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const {loading, getEntities, createEntity, deleteEntity, updateEntity, error, clearError} = useEntitiesService();

    useEffect(() => {
        getEntities('suppliers', setSuppliers);
        getEntities('invoices', setInvoices);
        getEntities('addresses', setAddress);
        getEntities('bank-accounts', setBankAccounts);
    }, []);

    const createSupplier = async (supplier) => {
        createEntity('suppliers', supplier, setSuppliers);
    }

    const updateSupplier = async (supplier, id) => {
        updateEntity('suppliers', supplier, setSuppliers, id);
    }

    const viewAllList = (list, name, title) => {
        const listFiltered = list.filter(item => item.supplier? item.supplier.name === name : null);
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">{title}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {listFiltered.map((item, i) => (
                        <Dropdown.Item key={i}>
                            {item.city? <ViewAddress address={item}/> : (item.id)}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Suppliers</h2>
                    <CreateOrUpdateSupplier createSupplier={createSupplier} isNew={true}/>
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
                        {suppliers.map((supplier, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{supplier.id}</td>
                                <td>{supplier.name}</td>
                                <td>{supplier.shortName}</td>
                                <td>{supplier.fullName}</td>
                                <td>{supplier.taxCode}</td>
                                <td>{viewAllList(invoices, supplier.name, 'Invoices')}</td>
                                <td>{viewAllList(addresses, supplier.name, 'Addresses')}</td>
                                <td>{viewAllList(bankAccounts, supplier.name, 'Bank Accounts')}</td>
                                <td>
                                    <Row>
                                        <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                            <CreateOrUpdateSupplier updateSupplier={updateSupplier} isNew={false} supplier={supplier}/>
                                        </Col>
                                        <Col style={{paddingRight: 3, paddingLeft: 3}}>
                                            <Button variant="secondary"><FiletypePdf/></Button>
                                        </Col>
                                        <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                            <Button
                                                onClick={() => deleteEntity('suppliers', supplier.id, setSuppliers)}
                                                variant="danger"><Trash3Fill/></Button>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default Supplier;


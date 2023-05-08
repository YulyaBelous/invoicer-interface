import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {FiletypePdf, PencilFill, Plus, Trash3Fill} from "react-bootstrap-icons";
import React, {useState, useEffect} from "react";
import useEntitiesService from "../entities-service";
import {CreateOrUpdateAddress} from "./address-create-or-update";
import {CreateOrUpdateInvoice} from "../invoice/invoice-create-or-update";

const Address = () => {
    const [addresses, setAddress] = useState([]);
    const {loading, getEntities, createEntity, deleteEntity, updateEntity, error, clearError} = useEntitiesService();

    useEffect(() => {
        getEntities('addresses', setAddress);
    }, []);

    const createAddress = async (address) => {
        createEntity('addresses', address, setAddress);
    }

    const updateAddress = async (address, id) => {
        updateEntity('addresses', address, setAddress, id);
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Address</h2>
                    <CreateOrUpdateAddress createAddress={createAddress} isNew={true}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Country</th>
                            <th>Province</th>
                            <th>Post code</th>
                            <th>City</th>
                            <th>Street line 1</th>
                            <th>Street line 2</th>
                            <th>Email</th>
                            <th>Phone 1</th>
                            <th>Phone 2</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {addresses.map((address, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{address.id}</td>
                                <td>{address.country}</td>
                                <td>{address.province}</td>
                                <td>{address.postCode}</td>
                                <td>{address.city}</td>
                                <td>{address.streetLine1}</td>
                                <td>{address.streetLine2}</td>
                                <td>{address.email}</td>
                                <td>{address.phone1}</td>
                                <td>{address.phone2}</td>
                                 <td>{address.supplier? address.supplier.name : ''}
                                     {address.customer? address.customer.name : ''}
                                 </td>
                                <td>
                                        <Row>
                                            <Col style={{paddingRight: 3, paddingLeft: 10}}>
                                                <CreateOrUpdateAddress updateAddress={updateAddress} address={address} isNew={false}/>
                                            </Col>
                                            <Col  style={{paddingRight: 3, paddingLeft: 3}}>
                                                <Button variant="secondary"><FiletypePdf/></Button>
                                            </Col>
                                            <Col  style={{paddingRight: 10, paddingLeft: 3}}>
                                                <Button onClick={() => deleteEntity('addresses', address.id, setAddress)}
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

export default Address;
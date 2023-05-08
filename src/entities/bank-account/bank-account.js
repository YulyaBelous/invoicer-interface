import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import ViewAddress from "../address/address-view";
import useEntitiesService from "../entities-service";
import {CreateOrUpdateBankAccount} from "./bank-account-create-or-update";
import {CreateOrUpdateInvoice} from "../invoice/invoice-create-or-update";

const BankAccount = () => {
    const [bankAccounts, setBankAccounts] = useState([]);
    const {loading, getEntities, createEntity, deleteEntity, updateEntity, error, clearError} = useEntitiesService();

    useEffect(() => {
        getEntities('bank-accounts', setBankAccounts);
    }, []);

    const createBankAccount = async (bankAccount) => {
        createEntity('bank-accounts', bankAccount, setBankAccounts);
    }

    const updateBankAccount = async (bankAccount, id) => {
        updateEntity('bank-accounts', bankAccount, setBankAccounts, id);
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Bank Accounts</h2>
                    <CreateOrUpdateBankAccount createBankAccount={createBankAccount} isNew={true}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Account number</th>
                            <th>Bank name</th>
                            <th>Swift</th>
                            <th>Address</th>
                            <th>Correspondent name</th>
                            <th>Correspondent address</th>
                            <th>Correspondent swift</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bankAccounts.map((account, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.accountNumber}</td>
                                <td>{account.bankName}</td>
                                <td>{account.swift}</td>
                                <td>{account.address ? <ViewAddress address={account.address}/> : ''}</td>
                                <td>{account.correspondentName}</td>
                                <td>{account.correspondentAddress}</td>
                                <td>{account.correspondentSwift}</td>
                                <td>
                                    <Row>
                                        <Col style={{paddingRight: 3, paddingLeft: 10}}>
                                            <CreateOrUpdateBankAccount updateBankAccount={updateBankAccount} bankAccount={account} isNew={false}/>
                                        </Col>
                                        <Col style={{paddingRight: 3, paddingLeft: 3}}>
                                            <Button variant="secondary"><FiletypePdf/></Button>
                                        </Col>
                                        <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                            <Button onClick={() => deleteEntity('bank-accounts', account.id, setBankAccounts)}
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

export default BankAccount;
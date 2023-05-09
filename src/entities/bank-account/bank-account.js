import React, {useState, useEffect} from "react";

import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../entities-service";
import {CreateOrUpdateBankAccount} from "./bank-account-create-or-update";

import ViewAddress from "../address/address-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";

const BankAccount = () => {

    const [bankAccounts, setBankAccounts] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('bank-accounts', setBankAccounts, currentPage).then(value => {
            setPageable(value);
        });
    }, []);

    const createBankAccount = async (bankAccount) => {
        await createEntity('bank-accounts', bankAccount, setBankAccounts, currentPage);
    }

    const updateBankAccount = async (bankAccount, id) => {
        await updateEntity('bank-accounts', bankAccount, setBankAccounts, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('bank-accounts', setBankAccounts, currentPage).then(value => {
            setPageable(value);
        });
    }

    const RenderBankAccount = () => {
        return(
            <Container fluid>
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
                                        <Button onClick={() => deleteEntity('bank-accounts', account.id, setBankAccounts, currentPage)}
                                                variant="danger"><Trash3Fill/></Button>
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
                <h2 style={{textAlign: "left"}}>Bank Accounts</h2>
                {loading? <Loading/> : <RenderBankAccount/>}
            </Card.Body>
        </Card>
    );

}

export default BankAccount;
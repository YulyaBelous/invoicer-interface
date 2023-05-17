import React, {useState, useEffect} from "react";

import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateBankAccount} from "./bank-account-create-or-update";

import ViewAddress from "../address/address-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";
import {NavLink} from "react-router-dom";
import ViewArrowSort from "../../shared/layout/view-arrow-sort";

const BankAccount = () => {

    const [bankAccounts, setBankAccounts] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");
    const [isAdmin, setIsAdmin] = useState(false);

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getEntities('bank-accounts', setBankAccounts, currentPage, user.username).then(value => {
            setPageable(value);
        });
        user.authorities.map((authority) => {
            if(authority === "ROLE_ADMIN") {
                setIsAdmin(true);
            }
        })
    }, []);

    const createBankAccount = async (bankAccount) => {
        await createEntity('bank-accounts', bankAccount, setBankAccounts, currentPage, user.username);
    }

    const updateBankAccount = async (bankAccount, id) => {
        await updateEntity('bank-accounts', bankAccount, setBankAccounts, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('bank-accounts', setBankAccounts, currentPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('bank-accounts', setBankAccounts, currentPage, user.username, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const RenderBankAccount = () => {
        return(
            <Container fluid>
                <CreateOrUpdateBankAccount createBankAccount={createBankAccount} isNew={true} isAdmin={isAdmin}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id <NavLink onClick={() => sort("id")}> <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Name <NavLink onClick={() => sort("name")}> <ViewArrowSort sortParam="name" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Account number <NavLink onClick={() => sort("accountNumber")}> <ViewArrowSort sortParam="accountNumber" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Bank name <NavLink onClick={() => sort("bankName")}> <ViewArrowSort sortParam="bankName" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Swift <NavLink onClick={() => sort("swift")}> <ViewArrowSort sortParam="swift" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Address <NavLink onClick={() => sort("address")}> <ViewArrowSort sortParam="address" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Corr. name <NavLink onClick={() => sort("correspondentName")}> <ViewArrowSort sortParam="correspondentName" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Corr. address <NavLink onClick={() => sort("correspondentAddress")}> <ViewArrowSort sortParam="correspondentAddress" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Corr. swift <NavLink onClick={() => sort("correspondentSwift")}> <ViewArrowSort sortParam="correspondentSwift" keySort={keySort} isSort={isSort}/> </NavLink></th>
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
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button onClick={() => deleteEntity('bank-accounts', account.id, setBankAccounts, currentPage, user.username)}
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
import React, {useState, useEffect} from "react";

import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateBankAccount} from "./bank-account-create-or-update";

import ViewAddress from "../address/address-view";
import Pageable from "../../shared/components/pageable";
import Loading from "../../shared/components/loading";
import SortButton from "../../shared/components/sort-button";

const BankAccount = () => {

    const [bankAccounts, setBankAccounts] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('bank-accounts', setBankAccounts, currentPage).then(value => setPageable(value));
    }, []);

    const createBankAccount = async (bankAccount) => {
        await createEntity('bank-accounts', bankAccount, setBankAccounts, currentPage);
    }

    const updateBankAccount = async (bankAccount, id) => {
        await updateEntity('bank-accounts', bankAccount, setBankAccounts, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('bank-accounts', setBankAccounts, curPage).then(value => setPageable(value));
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('bank-accounts', setBankAccounts, currentPage, sortParam, sortDirect).then(value => {
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
                        <th>Id
                            <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Name
                            <SortButton sortParam="name" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Account number
                            <SortButton sortParam="accountNumber" keySort={keySort} isSort={isSort} onSort={sort} />
                       </th>
                        <th>Bank name
                            <SortButton sortParam="bankName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Swift
                            <SortButton sortParam="swift" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Address
                            <SortButton sortParam="address" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Corr. name
                            <SortButton sortParam="correspondentName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Corr. address
                            <SortButton sortParam="correspondentAddress" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Corr. swift
                            <SortButton sortParam="correspondentSwift" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
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
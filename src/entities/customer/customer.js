import React, {useState, useEffect, useContext} from "react";

import {Button, Container, Table, Card, Dropdown, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateCustomer} from "./customer-create-or-update";
import ViewAddress from "../address/address-view";
import Pageable from "../../shared/components/pageable";
import Loading from "../../shared/layout/loading";
import SortButton from "../../shared/components/sort-button";
import AuthContext from "../../context/auth-context";

const Customer = () => {

    const [customers, setCustomers] = useState([]);

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
    }, []);

    const createCustomer = async (customer) => {
        await createEntity('customers', customer, setCustomers, currentPage, user.username);
    }

    const updateCustomer = async (customer, id) => {
        await updateEntity('customers', customer, setCustomers, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('customers', setCustomers, curPage, user.username).then(value => {
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

    const viewAllList = (list, title) => {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">{title}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {list? list.map((item, i) => (
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
                        <th>Id
                            <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Name
                            <SortButton sortParam="name" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Short name
                            <SortButton sortParam="shortName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Full name
                            <SortButton sortParam="fullName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Tax code
                            <SortButton sortParam="taxCode" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
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
                            <td>{viewAllList(customer?.invoices, 'Invoices')}</td>
                            <td>{viewAllList(customer?.addresses, 'Addresses')}</td>
                            <td>{viewAllList(customer?.bankAccounts, 'Bank Accounts')}</td>
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
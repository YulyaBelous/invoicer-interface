import React, {useState, useEffect, useContext} from "react";

import {Button, Container, Table, Card, Dropdown, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import CreateOrUpdateSupplier from "./supplier-create-or-update";
import ViewAddress from "../address/address-view";
import Pageable from "../../shared/components/pageable";
import Loading from "../../shared/components/loading";
import SortButton from "../../shared/components/sort-button";
import AuthContext from "../../utils/auth-context";

const Supplier = () => {

    const [suppliers, setSuppliers] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('suppliers', setSuppliers, currentPage, user.username).then(value => {
            setPageable(value);
        });
    }, []);

    const createSupplier = async (supplier, currentPage) => {
        await createEntity('suppliers', supplier, setSuppliers, currentPage, user.username);
    }

    const updateSupplier = async (supplier, id, currentPage) => {
        await updateEntity('suppliers', supplier, setSuppliers, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('suppliers', setSuppliers, curPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('suppliers', setSuppliers, currentPage, user.username, sortParam, sortDirect).then(value => {
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

    const RenderSupplier = () => {
        return(
            <Container fluid>
                <CreateOrUpdateSupplier createSupplier={createSupplier} isNew={true}/>
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
                    {suppliers.map((supplier, i) => (
                        <tr key={`entity-${i}`}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.shortName}</td>
                            <td>{supplier.fullName}</td>
                            <td>{supplier.taxCode}</td>
                            <td>{viewAllList(supplier?.invoices, 'Invoices')}</td>
                            <td>{viewAllList(supplier?.addresses, 'Addresses')}</td>
                            <td>{viewAllList(supplier?.bankAccounts, 'Bank Accounts')}</td>
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                        <CreateOrUpdateSupplier updateSupplier={updateSupplier} isNew={false} supplier={supplier}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button
                                            onClick={() => deleteEntity('suppliers', supplier.id, setSuppliers, currentPage, user.username)}
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
        );
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <h2 style={{textAlign: "left"}}>Suppliers</h2>
                {loading? <Loading/> : <RenderSupplier/>}
            </Card.Body>
        </Card>
    );
}

export default Supplier;


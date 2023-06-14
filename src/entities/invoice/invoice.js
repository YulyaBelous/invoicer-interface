import React, {useState, useEffect, useContext} from "react";

import {Button, Container, Table, Card, Row, Col} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateInvoice} from "./invoice-create-or-update";
import ViewSupplier from "../supplier/supplier-view";
import ViewCustomer from "../customer/customer-view";
import Pageable from "../../shared/components/pageable";
import Loading from "../../shared/components/loading";
import SortButton from "../../shared/components/sort-button";
import AuthContext from "../../utils/auth-context";

const Invoice = () => {

    const [invoices, setInvoices] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, reportEntity, loading} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect( () => {
         getEntities('invoices', setInvoices, currentPage, user.username).then(value => {
             setPageable(value);
         });
    }, []);

    const createInvoice = async (invoice) => {
         await createEntity('invoices', invoice, setInvoices, currentPage, user.username);
    }

    const updateInvoice = async (invoice, id) => {
        await updateEntity('invoices', invoice, setInvoices, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('invoices', setInvoices, curPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('invoices', setInvoices, currentPage, user.username, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const report = (nameEntity, id) => {
        reportEntity(nameEntity, id);
    }

    const RenderInvoice = () => {
            return (
                <Container fluid>
                    <CreateOrUpdateInvoice createInvoice={createInvoice} isNew={true} />
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id
                                <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Number
                                <SortButton sortParam="number" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Date
                                <SortButton sortParam="date" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Description
                                <SortButton sortParam="description" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Price
                                <SortButton sortParam="unitPrice" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Quantity
                                <SortButton sortParam="quantity" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Amount
                                <SortButton sortParam="amount" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Supplier
                                <SortButton sortParam="supplier" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Customer
                                <SortButton sortParam="customer" keySort={keySort} isSort={isSort} onSort={sort} />
                            </th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((invoice, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{invoice.id}</td>
                                <td>{invoice.number}</td>
                                <td>{invoice.date}</td>
                                <td>{invoice.description}</td>
                                <td>{invoice.unitPrice}</td>
                                <td>{invoice.quantity}</td>
                                <td>{invoice.amount}</td>
                                <td>{invoice.supplier ? <ViewSupplier supplier={invoice.supplier} addressSupplier={invoice.addressSupplier} bankAccountSupplier={invoice.bankAccountSupplier}/> : ''}</td>
                                <td>{invoice.customer ? <ViewCustomer customer={invoice.customer} addressCustomer={invoice.addressCustomer} bankAccountCustomer={invoice.bankAccountCustomer}/> : ''}</td>
                                <td>
                                    <Row>
                                        <Col style={{paddingRight: 3, paddingLeft: 10}}>
                                            <CreateOrUpdateInvoice updateInvoice={updateInvoice} invoice={invoice} isNew={false}/>
                                        </Col>
                                        <Col style={{paddingRight: 3, paddingLeft: 3}}>
                                            <Button onClick={() => report('invoices', invoice.id)} variant="secondary"><FiletypePdf/></Button>
                                        </Col>
                                        <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                            <Button onClick={() => deleteEntity('invoices', invoice.id, setInvoices, currentPage, user.username)}
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
                <h2 style={{textAlign: "left"}}>Invoices</h2>
                {loading? <Loading/> : <RenderInvoice/>}
            </Card.Body>
        </Card>
    );
}

export default Invoice;
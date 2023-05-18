import {useState, useEffect, useContext} from "react";

import {NavLink} from "react-router-dom";
import {Button, Container, Table, Card, Row, Col} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateInvoice} from "./invoice-create-or-update";
import ViewSupplier from "../supplier/supplier-view";
import ViewCustomer from "../customer/customer-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";
import ViewArrowSort from "../../shared/layout/view/view-arrow-sort";
import AuthContext from "../../context/auth-context";

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
                            <th>Id <NavLink onClick={() => sort("id")}> <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Number <NavLink onClick={() => sort("number")}> <ViewArrowSort sortParam="number" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Date <NavLink onClick={() => sort("date")}> <ViewArrowSort sortParam="date" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Description <NavLink onClick={() => sort("description")}> <ViewArrowSort sortParam="description" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Price <NavLink onClick={() => sort("unitPrice")}> <ViewArrowSort sortParam="unitPrice" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Quantity <NavLink onClick={() => sort("quantity")}> <ViewArrowSort sortParam="quantity" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Amount <NavLink onClick={() => sort("amount")}> <ViewArrowSort sortParam="amount" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Supplier <NavLink onClick={() => sort("supplier")}> <ViewArrowSort sortParam="supplier" keySort={keySort} isSort={isSort}/> </NavLink></th>
                            <th>Customer <NavLink onClick={() => sort("customer")}> <ViewArrowSort sortParam="customer" keySort={keySort} isSort={isSort}/> </NavLink></th>
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
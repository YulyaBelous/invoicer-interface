import {useState, useEffect} from "react";

import {Button, Container, Table, Card, Row, Col} from "react-bootstrap";
import {ChevronDown, FiletypePdf, Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../entities-service";
import {CreateOrUpdateInvoice} from "./invoice-create-or-update";
import ViewSupplier from "../supplier/supplier-view";
import ViewCustomer from "../customer/customer-view";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect( () => {
         getEntities('invoices', setInvoices, currentPage).then(value => {
             setPageable(value);
         });
    }, []);

    const createInvoice = async (invoice) => {
         await createEntity('invoices', invoice, setInvoices, currentPage);
    }

    const updateInvoice = async (invoice, id) => {
        await updateEntity('invoices', invoice, setInvoices, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('invoices', setInvoices, curPage).then(value => {
            setPageable(value);
        });
    }

    const RenderInvoice = () => {
            return (
                <Container fluid>
                    <CreateOrUpdateInvoice createInvoice={createInvoice} isNew={true}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id <ChevronDown/></th>
                            <th>Number</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Supplier</th>
                            <th>Customer</th>
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
                                            <Button variant="secondary"><FiletypePdf/></Button>
                                        </Col>
                                        <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                            <Button onClick={() => deleteEntity('invoices', invoice.id, setInvoices, currentPage)}
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
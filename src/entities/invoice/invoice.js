import {Button, Container, Table, Card, Row, Col} from "react-bootstrap";
import {FiletypePdf, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import ViewSupplier from "../supplier/supplier-view";
import ViewCustomer from "../customer/customer-view";
import useEntitiesService from "../entities-service";
import {CreateOrUpdateInvoice} from "./invoice-create-or-update";
import Pageable from "../../shared/layout/pageable";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const {loading, getEntities, createEntity, deleteEntity, updateEntity, error, clearError} = useEntitiesService();

    useEffect( () => {
         getEntities('invoices', setInvoices);
    }, []);

    const createInvoice = async (invoice) => {
         await createEntity('invoices', invoice, setInvoices);
    }

    const updateInvoice = async (invoice, id) => {
        await updateEntity('invoices', invoice, setInvoices, id);
    }

    return(
    <Card style={{margin: 12}}>
        <Card.Body>
            <Container fluid>
                <h2 style={{textAlign: "left"}}>Invoices</h2>
                <CreateOrUpdateInvoice createInvoice={createInvoice} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id</th>
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
                                    <Button onClick={() => deleteEntity('invoices', invoice.id, setInvoices)} variant="danger"><Trash3Fill/></Button>
                                </Col>
                            </Row>
                        </td>
                           </tr>
                        ))}
                    </tbody>
                </Table>
                <Pageable currentPage = {1}/>
            </Container>
        </Card.Body>
    </Card>
    );
}

export default Invoice;
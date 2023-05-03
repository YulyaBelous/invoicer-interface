import axios from 'axios';
import {Button, Container, Table, Card} from "react-bootstrap";
import {FiletypePdf, PencilFill, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import CreateInvoice from "./invoice-create";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
         await axios.get("http://localhost:8080/api/invoices")
            .then(data => {
                setInvoices(data.data)
            })
            .catch(err => console.error(err));
    }

    const createInvoice = async (invoice) => {
        await axios.post(`http://localhost:8080/api/invoices`,  invoice)
            .then(() => fetchInvoices())
            .catch(err => console.error(err))
    }

    const deleteInvoice = async (id) => {
        await axios.delete(`http://localhost:8080/api/invoices/${id}`)
            .then(() => fetchInvoices())
    }

    return(
    <Card style={{margin: 12}}>
        <Card.Body>
            <Container fluid>
                <h2 style={{textAlign: "left"}}>Invoices</h2>
                <CreateInvoice createInvoice={createInvoice}/>
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
                        <td>{invoice.supplier ? 1 : ''}</td>
                        <td>{invoice.customer ? 1 : ''}</td>
                        <td> <Button variant="primary"><PencilFill/></Button> <Button variant="secondary"><FiletypePdf/></Button> <Button onClick={() => deleteInvoice(invoice.id)}
                         variant="danger"><Trash3Fill/></Button></td>
                    </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Card.Body>
    </Card>
    );
}

export default Invoice;
import axios from 'axios';
import {Button, Container, Table, Card} from "react-bootstrap";
import {FiletypePdf, PencilFill, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import CreateCustomer from "./customer-create";

const Customer = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        await axios.get("http://localhost:8080/api/customers")
            .then(data => {
                setCustomers(data.data)
            })
            .catch(err => console.error(err));
    }

    const createCustomer = async (customer) => {
        await axios.post(`http://localhost:8080/api/customers`,  customer)
            .then(() => fetchCustomers())
            .catch(err => console.error(err))
    }

    const deleteCustomer = async (id) => {
        await axios.delete(`http://localhost:8080/api/customers/${id}`)
            .then(() => fetchCustomers())
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Customers</h2>
                    <CreateCustomer createCustomer={createCustomer}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Short name</th>
                            <th>Full name</th>
                            <th>Tax code</th>
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
                                <td>{customer.invoises ? 1 : ''}</td>
                                <td>{customer.addresses ? 1 : ''}</td>
                                <td>{customer.bankAccounts ? 1 : ''}</td>
                                <td> <Button variant="primary"><PencilFill/></Button> <Button variant="secondary"><FiletypePdf/></Button> <Button onClick={() => deleteCustomer(customer.id)}
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

export default Customer;
import axios from 'axios';
import {Button, Container, Table, Card} from "react-bootstrap";
import {FiletypePdf, PencilFill, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import CreateSupplier from "./supplier-create";

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        await axios.get("http://localhost:8080/api/suppliers")
            .then(data => {
                setSuppliers(data.data)
            })
            .catch(err => console.error(err));
    }

    const createSupplier = async (supplier) => {
        await axios.post(`http://localhost:8080/api/suppliers`,  supplier)
            .then(() => fetchSuppliers())
            .catch(err => console.error(err))
    }

    const deleteSupplier = async (id) => {
        await axios.delete(`http://localhost:8080/api/suppliers/${id}`)
            .then(() => fetchSuppliers())
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Suppliers</h2>
                    <CreateSupplier createSupplier={createSupplier}/>
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
                        {suppliers.map((supplier, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{supplier.id}</td>
                                <td>{supplier.name}</td>
                                <td>{supplier.shortName}</td>
                                <td>{supplier.fullName}</td>
                                <td>{supplier.taxCode}</td>
                                <td>{supplier.invoises ? 1 : ''}</td>
                                <td>{supplier.addresses ? 1 : ''}</td>
                                <td>{supplier.bankAccounts ? 1 : ''}</td>
                                <td> <Button variant="primary"><PencilFill/></Button> <Button variant="secondary"><FiletypePdf/></Button> <Button onClick={() => deleteSupplier(supplier.id)}
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

export default Supplier;
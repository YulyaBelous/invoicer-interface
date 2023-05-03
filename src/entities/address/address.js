import axios from 'axios';
import {Button, Container, Table, Card} from "react-bootstrap";
import {FiletypePdf, PencilFill, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import CreateAddress from "./address-create";

const Address = () => {
    const [addresses, setAddress] = useState([]);

    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        await axios.get("http://localhost:8080/api/addresses")
            .then(data => {
                setAddress(data.data)
            })
            .catch(err => console.error(err));
    }

    const createAddress = async (address) => {
        await axios.post(`http://localhost:8080/api/addresses`,  address)
            .then(() => fetchAddress())
            .catch(err => console.error(err))
    }

    const deleteAddress = async (id) => {
        await axios.delete(`http://localhost:8080/api/addresses/${id}`)
            .then(() => fetchAddress())
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Address</h2>
                    <CreateAddress createAddress={createAddress}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Country</th>
                            <th>Province</th>
                            <th>Post code</th>
                            <th>City</th>
                            <th>Street line 1</th>
                            <th>Street line 2</th>
                            <th>Email</th>
                            <th>Phone 1</th>
                            <th>Phone 2</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {addresses.map((address, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{address.id}</td>
                                <td>{address.country}</td>
                                <td>{address.province}</td>
                                <td>{address.postCode}</td>
                                <td>{address.city}</td>
                                <td>{address.streetLine1}</td>
                                <td>{address.streetLine2}</td>
                                <td>{address.email}</td>
                                <td>{address.phone1}</td>
                                <td>{address.phone2}</td>
                                <td> <Button variant="primary"><PencilFill/></Button> <Button variant="secondary"><FiletypePdf/></Button> <Button onClick={() => deleteAddress(address.id)}
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

export default Address;
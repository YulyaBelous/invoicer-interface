import axios from 'axios';
import {Button, Container, Table, Card} from "react-bootstrap";
import {FiletypePdf, PencilFill, Trash3Fill} from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import CreateBankAccount from "./bank-account-create";

const BankAccount = () => {
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const fetchBankAccounts = async () => {
        await axios.get("http://localhost:8080/api/bank-accounts")
            .then(data => {
                setBankAccounts(data.data)
            })
            .catch(err => console.error(err));
    }

    const createBankAccount = async (bankAccount) => {
        await axios.post(`http://localhost:8080/api/bank-accounts`,  bankAccount)
            .then(() => fetchBankAccounts())
            .catch(err => console.error(err))
    }

    const deleteBankAccount = async (id) => {
        await axios.delete(`http://localhost:8080/api/bank-accounts/${id}`)
            .then(() => fetchBankAccounts())
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <Container fluid>
                    <h2 style={{textAlign: "left"}}>Bank Accounts</h2>
                    <CreateBankAccount createBankAccount={createBankAccount}/>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Account number</th>
                            <th>Bank name</th>
                            <th>Swift</th>
                            <th>Correspondent name</th>
                            <th>Correspondent address</th>
                            <th>Correspondent swift</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bankAccounts.map((account, i) => (
                            <tr key={`entity-${i}`}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.accountNumber}</td>
                                <td>{account.bankName}</td>
                                <td>{account.swift}</td>
                                <td>{account.correspondentName}</td>
                                <td>{account.correspondentAddress}</td>
                                <td>{account.correspondentSwift}</td>
                                <td>{account.address ? 1 : ''}</td>
                                <td> <Button variant="primary"><PencilFill/></Button> <Button variant="secondary"><FiletypePdf/></Button> <Button onClick={() => deleteBankAccount(account.id)}
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

export default BankAccount;
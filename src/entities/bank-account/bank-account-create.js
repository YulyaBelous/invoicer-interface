import React, {useState} from 'react';
import {Plus} from "react-bootstrap-icons";
import {Button, Form, Modal} from "react-bootstrap";
function CreateBankAccount(props) {
    const [show, setShow] = useState(false);
    const [bankAccount, setBankAccount] = useState();
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setBankAccount({...bankAccount, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        props.createBankAccount(bankAccount);
        handleClose();
    }

    return (
        <div>
            <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New bank account</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new Bank Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Account number</Form.Label>
                            <Form.Control name="accountNumber"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Bank name</Form.Label>
                            <Form.Control name="bankName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Swift</Form.Label>
                            <Form.Control name="swift"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent name</Form.Label>
                            <Form.Control name="correspondentName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent address</Form.Label>
                            <Form.Control name="correspondentAddress"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent swift</Form.Label>
                            <Form.Control name="correspondentSwift"/>
                        </Form.Group>
                        <Button className="d-block mx-auto"  onClick={handleSave} variant="primary" >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default CreateBankAccount;
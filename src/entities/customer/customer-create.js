import React, {useState} from 'react';
import {Plus} from "react-bootstrap-icons";
import {Button, Form, Modal} from "react-bootstrap";
function CreateCustomer(props) {
    const [show, setShow] = useState(false);
    const [customer, setCustomer] = useState();
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        props.createCustomer(customer);
        handleClose();
    }

    return (
        <div>
            <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New customer</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Short name</Form.Label>
                            <Form.Control name="shortName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Full name</Form.Label>
                            <Form.Control name="fullName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Tax code</Form.Label>
                            <Form.Control name="taxCode"/>
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

export default CreateCustomer;
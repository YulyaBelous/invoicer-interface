import React, {useState} from 'react';
import {Plus} from "react-bootstrap-icons";
import {Button, Form, Modal} from "react-bootstrap";
function CreateAddress(props) {
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState();
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setAddress({...address, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        props.createAddress(address);
        handleClose();
    }

    return (
        <div>
            <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New address</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Country</Form.Label>
                            <Form.Control name="country"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Province</Form.Label>
                            <Form.Control name="province"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Post code</Form.Label>
                            <Form.Control name="postCode"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >City</Form.Label>
                            <Form.Control name="city"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 1</Form.Label>
                            <Form.Control name="streetLine1"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 2</Form.Label>
                            <Form.Control name="streetLine2"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Email</Form.Label>
                            <Form.Control name="email"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 1</Form.Label>
                            <Form.Control name="phone1"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 2</Form.Label>
                            <Form.Control name="phone2"/>
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

export default CreateAddress;
import React, {useState} from 'react';
import {Plus} from "react-bootstrap-icons";
import {Button, Form, Modal} from "react-bootstrap";
function CreateInvoice(props) {
    const [show, setShow] = useState(false);
    const [invoice, setInvoice] = useState();
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setInvoice({...invoice, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        props.createInvoice(invoice);
        handleClose();
    }

    return (
        <div>
            <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New invoice</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Number</Form.Label>
                            <Form.Control name="number"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Date</Form.Label>
                            <Form.Control type="date" name="date"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Description</Form.Label>
                            <Form.Control name="description"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Price</Form.Label>
                            <Form.Control name="unitPrice"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Quantity</Form.Label>
                            <Form.Control name="quantity"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Amount</Form.Label>
                            <Form.Control name="amount"/>
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

export default CreateInvoice;
import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";


const InvoiceView = () => {

    const [show, setShow] = useState(false);
    const [invoice, setInvoice] = useState();

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    return(
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
                    <Form.Select className="mb-3" name="supplier">
                        <option>Select Supplier</option>
                        {
                            suppliers ? suppliers.map(supplier =>
                                <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                            ) : null
                        }
                    </Form.Select>
                    <Form.Select className="mb-3" name="customer">
                        <option>Select Customer</option>
                        {
                            customers ? customers.map(customer =>
                                <option value={customer.id} key={customer.id}>{customer.name}</option>
                            ) : null
                        }
                    </Form.Select>
                    <Button className="d-block mx-auto"  onClick={handleSave} variant="primary" >
                        Submit
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default InvoiceView;
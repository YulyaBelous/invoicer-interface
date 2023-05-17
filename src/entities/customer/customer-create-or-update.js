import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

export const CreateOrUpdateCustomer = (props) => {
    const [customer, setCustomer] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);

    const username = JSON.parse(localStorage.getItem("user")).username;

    useEffect(() => {
        setIsNew(props.isNew);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        if(props.isAdmin) {
            setCustomer({...props.customer});
        } else {
            setCustomer({...props.customer, username : username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        isNew?  props.createCustomer(customer) : props.updateCustomer(customer, customer.id);
        handleClose();
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New customer</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Customer' : `Edit Customer ${props.customer?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control defaultValue={props.customer?.name} name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Short name</Form.Label>
                            <Form.Control defaultValue={props.customer?.shortName}  name="shortName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Full name</Form.Label>
                            <Form.Control defaultValue={props.customer?.fullName}  name="fullName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Tax code</Form.Label>
                            <Form.Control defaultValue={props.customer?.taxCode}  name="taxCode"/>
                        </Form.Group>
                        <Button className="d-block mx-auto"  onClick={handleSave} variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

const CreateOrUpdateSupplier = (props) => {
    const [supplier, setSupplier] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);

    const username = JSON.parse(localStorage.getItem("user")).username;

    useEffect(() => {
        setIsNew(props.isNew);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        if(props.isAdmin) {
            setSupplier({...props.supplier});
        } else {
            setSupplier({...props.supplier, username : username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setSupplier({...supplier, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        isNew?  props.createSupplier(supplier) : props.updateSupplier(supplier, supplier.id);
        handleClose();
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New supplier</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Supplier' : `Edit Supplier ${props.supplier?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control defaultValue={props.supplier?.name} name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Short name</Form.Label>
                            <Form.Control defaultValue={props.supplier?.shortName}  name="shortName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Full name</Form.Label>
                            <Form.Control defaultValue={props.supplier?.fullName}  name="fullName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Tax code</Form.Label>
                            <Form.Control defaultValue={props.supplier?.taxCode}  name="taxCode"/>
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

export default CreateOrUpdateSupplier;

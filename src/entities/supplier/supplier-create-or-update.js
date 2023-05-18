import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import AuthContext from "../../context/auth-context";
import Validation from "../validation";

const CreateOrUpdateSupplier = (props) => {

    const [supplier, setSupplier] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {user, isAdmin} = useContext(AuthContext);

    const {validation} = Validation();

    useEffect(() => {
        setIsNew(props.isNew);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        if(isAdmin) {
            setSupplier({...props.supplier});
        } else {
            setSupplier({...props.supplier, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setSupplier({...supplier, [event.target.name]: event.target.value});
        if (!!errors[event.target.name]) {
            setErrors({...errors, [event.target.name]: null})
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            const supplierEntity = {...supplier, ...values}
            isNew?  props.createSupplier(supplierEntity) : props.updateSupplier(supplierEntity, supplierEntity.id);
            handleClose();
        }
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
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control isInvalid={!!errors.name} defaultValue={props.supplier?.name} name="name"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.name }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Short name</Form.Label>
                            <Form.Control isInvalid={!!errors.shortName} defaultValue={props.supplier?.shortName}  name="shortName"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.shortName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Full name</Form.Label>
                            <Form.Control isInvalid={!!errors.fullName} defaultValue={props.supplier?.fullName}  name="fullName"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.fullName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Tax code</Form.Label>
                            <Form.Control isInvalid={!!errors.taxCode} defaultValue={props.supplier?.taxCode}  name="taxCode"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.taxCode }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CreateOrUpdateSupplier;

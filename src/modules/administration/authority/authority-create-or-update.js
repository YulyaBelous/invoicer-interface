import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import Validation from "../../../utils/validation";

export const CreateOrUpdateAuthority = (props) => {

    const [authority, setAuthority] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {validation} = Validation();

    useEffect(() => {
        setIsNew(props.isNew);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        setAuthority({...props.authority});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setAuthority({...authority, [event.target.name]: event.target.value});
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
            const authorityEntity = {...authority, ...values}
            isNew ? props.createAuthority(authorityEntity) : props.updateAuthority(authorityEntity, authorityEntity.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New authority</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Authority' : `Edit Authority ${props.authority?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control isInvalid={!!errors.name} defaultValue={props.authority?.name} name="name"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.name }
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

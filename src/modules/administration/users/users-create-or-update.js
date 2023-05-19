import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import useEntitiesService from "../../../services/entities-service";
import Validation from "../../../entities/validation";

const CreateOrUpdateUsers = (props) => {

    const [user, setUser] = useState([]);
    const [authorities, setAuthorities] = useState([]);

    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {validation} = Validation();

    const {getEntities} = useEntitiesService();

    useEffect(() => {
        setIsNew(props.isNew);
        getEntities('admin/authorities', setAuthorities);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
            setUser({...props.user});
    };

    const handleClose = () => {
        setShow(false);
    };

    const setField = (e) => {
        if ( !!errors[e.target.name] ) setErrors({...errors, [e.target.name]: null})
    }

    const handleChange = (event) => {
        if(user?.authorities) {
            setUser({...user, authorities: [...user.authorities, event.target.value]})
        } else {
            setUser({...user, authorities: [event.target.value]})
        }
        setField(event);
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const userEntity = {...user, ...values, authorities: user.authorities}
        const newErrors = validation(userEntity);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            isNew ? props.createUser(userEntity) : props.updateUser(userEntity, user.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New user</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new User' : `Edit User ${props.user?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >First name</Form.Label>
                            <Form.Control onChange={setField}
                                          isInvalid={!!errors.firstName}
                                          defaultValue={props.user?.firstName}
                                          name="firstName"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.firstName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Last name</Form.Label>
                            <Form.Control onChange={setField}
                                          isInvalid={!!errors.lastName}
                                          defaultValue={props.user?.lastName}
                                          name="lastName"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.lastName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Username</Form.Label>
                            <Form.Control onChange={setField}
                                          isInvalid={!!errors.username}
                                          defaultValue={props.user?.username}
                                          name="username"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.username }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Email</Form.Label>
                            <Form.Control onChange={setField}
                                          isInvalid={!!errors.email}
                                          defaultValue={props.user?.email}
                                          name="email"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.email }
                            </Form.Control.Feedback>
                        </Form.Group>
                        {isNew? <Form.Group className="mb-3">
                            <Form.Label >Password</Form.Label>
                            <Form.Control onChange={setField}
                                          isInvalid={!!errors.password}
                                          defaultValue={props.user?.password}
                                          name="password"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group> : null}
                        <Form.Group>
                            <Form.Label >Authorities</Form.Label>
                            <Form.Select onChange={handleChange} isInvalid={!!errors.authorities} name="authorities" multiple>
                                {authorities?.map(role => (
                                    <option value={role.name} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                { errors.authorities }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="d-block mx-auto"  type="submit" variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CreateOrUpdateUsers;
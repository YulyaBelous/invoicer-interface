import {Alert, Button, Form, Modal, NavDropdown} from "react-bootstrap";
import React, {useState} from "react";
import {CaretRightFill} from "react-bootstrap-icons";
import useUserService from "../../services/user-service";
import Validation from "../../entities/validation";

const RegisterForm = () => {

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState();

    const {register, error, clearError, loading} = useUserService();
    const {validation} = Validation();

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if (!!errors[event.target.name]) {
            setErrors({...errors, [event.target.name]: null})
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            clearError();
            const res = await register(values);
            setMessage(res.message);
        }
    }

    const viewMessage = (message, variant) => {
        return (<> <Alert key={variant} variant={variant}> {message} </Alert> </>)
    }

    return(
        <>
            <NavDropdown.Item onClick={handleClickOpen} > <CaretRightFill color="royalblue"/> Registration</NavDropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control isInvalid={!!errors.username} name="username" placeholder="Username"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.username }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First name</Form.Label>
                            <Form.Control isInvalid={!!errors.firstName} name="firstName" placeholder="First name"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.firstName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control isInvalid={!!errors.lastName} name="lastName" placeholder="Last name"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.lastName }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control isInvalid={!!errors.email} name="email" type="email" placeholder="Email"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.email }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control isInvalid={!!errors.password} name="password" type="password" placeholder="Password"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group>
                        {message? (error? viewMessage(message, "danger") : viewMessage(message, "success")) : (null)}
                        <div className="d-grid gap-2">
                            <Button type="submit" disabled={loading} variant="primary" >
                                {loading? "Loading..." : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RegisterForm;
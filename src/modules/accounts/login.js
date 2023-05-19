import React, {useContext, useState} from "react";
import {Alert, Button, Form, Modal, NavDropdown} from "react-bootstrap";
import {CaretRightFill, PersonCircle} from "react-bootstrap-icons";

import useUserService from "../../services/user-service";
import AuthContext from "../../context/auth-context";
import Validation from "../../entities/validation";

const LoginForm = () => {

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const {login, error, clearError, loading} = useUserService();
    const {validation} = Validation();

    const {logIn, isActivated} = useContext(AuthContext);

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
            setMessage(null);
            const res = await login(values);
            if(typeof(res) !== "string") {
                logIn();
                if(!isActivated) {
                    setMessage("Account not activated");
                } else {
                    handleClose();
                }
            }
            if(!isActivated) {
                setMessage("Account not activated");
            }
        }
    }

    const viewMessage = (message, variant) => {
        return (<> <Alert key={variant} variant={variant}> {message} </Alert> </>)
    }

    return(
        <>
            <NavDropdown.Item onClick={handleClickOpen} > <CaretRightFill color="royalblue"/> Log in</NavDropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Log in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ><PersonCircle className="d-block mx-auto" size={100} style={{color: "gray"}}/></div>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control isInvalid={!!errors.username} name="username" placeholder="Username"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.username }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control isInvalid={!!errors.password}  name="password" type="password" placeholder="Password"/>
                            <Form.Control.Feedback type="invalid">
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group>
                        {error? (viewMessage(error, "danger")) : (message !== null? viewMessage(message, "danger") : null)}
                        <div className="d-grid gap-2">
                            <Button type="submit"  disabled={loading}  variant="primary" >
                                {loading? "Loading..." : "Log in"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LoginForm;
import {Button, Form, Modal, NavDropdown} from "react-bootstrap";
import React, {useState} from "react";
import {CaretRightFill} from "react-bootstrap-icons";
import useUserService from "../../services/user-service";

const LoginForm = (props) => {

    const [show, setShow] = useState(false);

    const {login} = useUserService();

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const res = await login(values);
        props.handleLogIn(true);
        handleClose();
    }

    return(
        <>
            <NavDropdown.Item onClick={handleClickOpen} > <CaretRightFill color="royalblue"/> Log in</NavDropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Log in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => handleSave(e)}>
                            <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name="username" placeholder="Username"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" type="password" placeholder="Password"/>
                        </Form.Group>
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Log in
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LoginForm;
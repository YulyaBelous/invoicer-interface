import {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../utils/auth-context";
import {Button, Container, Modal} from "react-bootstrap";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = () => {

    const {user, logOut} = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    let location = useLocation();
    const navigation = useNavigate();

    useEffect(() => {
        if (user) {
            const decodedJwt = parseJwt(user.accessToken);
            if ((decodedJwt.exp * 1000) < Date.now()) {
                logOut();
                setOpen(true);
                navigation("/");
            }
        }
    }, [location]);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Container className="mt-4">
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Session has expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your session has expired. Log in to your account to access the functionality of the application</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default AuthVerify;
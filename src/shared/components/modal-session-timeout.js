import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Container, Modal} from "react-bootstrap";

import AuthContext from "../../utils/auth-context";
import useIdleTimeout from "../../utils/hooks/hook-timeout";


const ModalSessionTimeout = () => {

    const [openModal, setOpenModal] = useState(false)

    const { logOut } = useContext(AuthContext);
    const navigation = useNavigate();

    const handleIdle = () => {
        setOpenModal(true);
    }
    const { idleTimer } = useIdleTimeout({ onIdle: handleIdle, idleTime: 1800 })

    const stay = () => {
        setOpenModal(false)
        idleTimer.reset()
    }

    const handleLogout = () => {
        navigation("/");
        logOut()
        setOpenModal(false)
    }
    return(
        <Container className="mt-4">
            <Modal show={openModal} onHide={stay}>
                <Modal.Header closeButton>
                    <Modal.Title>Your session is about to expire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Your session is about to expire. You'll be automatically signed out.
                    </p>
                    <p>
                        Do you want to stay signed in?
                    </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLogout}>
                        Sign out now
                    </Button>
                    <Button variant="primary" onClick={stay}>
                        Stay signed in
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ModalSessionTimeout;
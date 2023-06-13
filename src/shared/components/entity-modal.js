import React from 'react';
import {Modal} from "react-bootstrap";

const EntityModal = (props) => {

    const {show, handleClose, title, children} = props;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default EntityModal;
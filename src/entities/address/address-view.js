import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Button, Container, Modal} from "react-bootstrap";
import {PencilFill, XSquareFill} from "react-bootstrap-icons";

const ViewAddress = (props) => {

    const [show, setShow] = useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <NavLink onClick={handleClickOpen}>{props.address.city}</NavLink>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: "royalblue"}}>View Address {props.address.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <h5>Country</h5>
                        <p style={{fontSize: 17}}>{props.address.country}</p>
                        <h5>Province</h5>
                        <p style={{fontSize: 17}}>{props.address.province}</p>
                        <h5>Post code</h5>
                        <p style={{fontSize: 17}}>{props.address.postCode}</p>
                        <h5>City</h5>
                        <p style={{fontSize: 17}}>{props.address.city}</p>
                        <h5>Street Line 1</h5>
                        <p style={{fontSize: 17}}>{props.address?.streetLine1}</p>
                        {
                            props.address?.streetLine2? <>
                                <h5>Street Line 2</h5>
                                <p style={{fontSize: 17}}>{props.address?.streetLine2}</p>
                            </> : null
                        }
                        <h5>Email</h5>
                        <p style={{fontSize: 17}}>{props.address?.email}</p>
                        <h5>Phone 1</h5>
                        <p style={{fontSize: 17}}>{props.address?.phone1}</p>
                        {
                            props.address?.phone2? <>
                                <h5>Phone 2</h5>
                                <p style={{fontSize: 17}}>{props.address?.phone2}</p>
                            </> : null
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} variant="secondary"><XSquareFill/> Close</Button>
                    <Button variant="primary"><PencilFill/> Edit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewAddress;
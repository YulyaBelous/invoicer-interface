import {Button, Container, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {PencilFill, XSquareFill} from "react-bootstrap-icons";

const ViewBankAccount = (props) => {

    const [show, setShow] = useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <NavLink onClick={handleClickOpen}>{props.customer.name}</NavLink>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: "royalblue"}}>View Customer {props.customer.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <h5>Name</h5>
                        <p style={{fontSize: 17}}>{props.customer.name}</p>
                        <h5>Short name</h5>
                        <p style={{fontSize: 17}}>{props.customer.shortName}</p>
                        <h5>Full name</h5>
                        <p style={{fontSize: 17}}>{props.customer.fullName}</p>
                        <h5>Tax code</h5>
                        <p style={{fontSize: 17}}>{props.customer.taxCode}</p>
                        <h4 style={{color: "royalblue", textAlign: "center"}}>Address</h4>
                        <h5>Country</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.country}</p>
                        <h5>Province</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.province}</p>
                        <h5>Post code</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.postCode}</p>
                        <h5>City</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.city}</p>
                        <h5>Street Line 1</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.streetLine1}</p>
                        {
                            props.addressCustomer?.streetLine2? <>
                                <h5>Street Line 2</h5>
                                <p style={{fontSize: 17}}>{props.addressCustomer?.streetLine2}</p>
                            </> : null
                        }
                        <h5>Email</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.email}</p>
                        <h5>Phone 1</h5>
                        <p style={{fontSize: 17}}>{props.addressCustomer?.phone1}</p>
                        {
                            props.addressCustomer?.phone2? <>
                                <h5>Phone 2</h5>
                                <p style={{fontSize: 17}}>{props.addressCustomer?.phone2}</p>
                            </> : null
                        }
                        <h4 style={{color: "royalblue", textAlign: "center"}}>Bank Account</h4>
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

export default ViewBankAccount;
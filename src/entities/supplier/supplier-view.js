import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {PencilFill, XSquareFill} from "react-bootstrap-icons";
import ViewAddress from "../address/address-view";

const ViewSupplier = (props) => {

    const [show, setShow] = useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <NavLink onClick={handleClickOpen}>{props.supplier.name}</NavLink>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: "royalblue"}}>View Supplier {props.supplier.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col style={{textAlign:"center"}}>
                                <h5>Name</h5>
                                <p style={{fontSize: 17}}>{props.supplier.name}</p>
                                <h5>Short name</h5>
                                <p style={{fontSize: 17}}>{props.supplier.shortName}</p>
                                <h5>Full name</h5>
                                <p style={{fontSize: 17}}>{props.supplier.fullName}</p>
                                <h5>Tax code</h5>
                                <p style={{fontSize: 17}}>{props.supplier.taxCode}</p>
                            </Col>
                        </Row>
                       <Row>
                           <Col>
                               <h4 style={{color: "royalblue", textAlign: "center"}}>Address</h4>
                               <h5>Country</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.country}</p>
                               <h5>Province</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.province}</p>
                               <h5>Post code</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.postCode}</p>
                               <h5>City</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.city}</p>
                               <h5>Street Line 1</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.streetLine1}</p>
                               {
                                   props.addressSupplier?.streetLine2? <>
                                       <h5>Street Line 2</h5>
                                       <p style={{fontSize: 17}}>{props.addressSupplier?.streetLine2}</p>
                                   </> : null
                               }
                               <h5>Email</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.email}</p>
                               <h5>Phone 1</h5>
                               <p style={{fontSize: 17}}>{props.addressSupplier?.phone1}</p>
                               {
                                   props.addressSupplier?.phone2? <>
                                       <h5>Phone 2</h5>
                                       <p style={{fontSize: 17}}>{props.addressSupplier?.phone2}</p>
                                   </> : null
                               }
                           </Col>
                           <Col>
                               <h4 style={{color: "royalblue", textAlign: "center"}}>Bank Account</h4>
                               <h5>Name</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.name}</p>
                               <h5>Account number</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.accountNumber}</p>
                               <h5>Bank name</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.bankName}</p>
                               <h5>Swift</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.swift}</p>
                               <h5>Address</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.address ? <ViewAddress address={props.bankAccountSupplier.address}/> : ''}</p>
                               <h5>Correspondent name</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.correspondentName}</p>
                               <h5>Correspondent address</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.correspondentAddress}</p>
                               <h5>Correspondent swift</h5>
                               <p style={{fontSize: 17}}>{props.bankAccountSupplier?.correspondentSwift}</p>
                           </Col>
                       </Row>
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

export default ViewSupplier;
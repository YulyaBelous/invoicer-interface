import React, {useContext, useEffect, useState} from "react";
import {Button, ButtonGroup, Form, Modal, ToggleButton} from "react-bootstrap";
import useEntitiesService from "../../services/entities-service";
import {PencilFill, Plus} from "react-bootstrap-icons";
import AuthContext from "../../context/auth-context";
import Validation from "../validation";
import ViewSupplierOrCustomer from "../../shared/layout/view/view-supplier-or-customer";

export const CreateOrUpdateAddress = (props) => {

    const [address, setAddress] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [radioValue, setRadioValue] = useState('1');
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {getEntities} = useEntitiesService();
    const {validation} = Validation();

    const {user, isAdmin, isSupplier, isCustomer} = useContext(AuthContext);

    const radios = [
        { name: 'Supplier', value: '1' },
        { name: 'Customer', value: '2' }
    ];

    useEffect(() => {
        if(isAdmin || isSupplier) {
            getEntities('suppliers', setSuppliers, 0, user.username);
        }
        if(isAdmin || isCustomer) {
            getEntities('customers', setCustomers, 0, user.username);
        }
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        if(!isNew) {
            props.address.customer? setRadioValue('2'): setRadioValue('1');
        }
        setShow(true);
        if(isAdmin) {
            setAddress({...props.address});
        } else {
            setAddress({...props.address, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if(event.target.name === "supplier" || event.target.name === "customer") {
            setAddress({
                ...address,
                supplier: event.target.name === "supplier"? suppliers.find(it => it.id.toString() === event.target.value.toString()) : null,
                customer: event.target.name === "customer"? customers.find(it => it.id.toString() === event.target.value.toString()) : null,
            });
        }
        if ( !!errors[event.target.name] ) setErrors({...errors, [event.target.name]: null})
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            const supplier = isSupplier? suppliers.find(it => it.username === user.username) : address?.supplier;
            const customer = isCustomer? customers.find(it => it.username === user.username) : address?.customer;
            const addressEntity = {
                ...address,
                ...values,
                supplier: supplier,
                customer: customer
            }
            isNew?  props.createAddress(addressEntity) : props.updateAddress(addressEntity, addressEntity.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New address</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Address' : `Edit Address ${props.address?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Country</Form.Label>
                            <Form.Control isInvalid={!!errors.country}
                                          defaultValue={props.address?.country}
                                          name="country"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.country}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Province</Form.Label>
                            <Form.Control isInvalid={!!errors.province}
                                          defaultValue={props.address?.province}
                                          name="province"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.province}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Post code</Form.Label>
                            <Form.Control isInvalid={!!errors.postCode}
                                          defaultValue={props.address?.postCode}
                                          name="postCode"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.postCode}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >City</Form.Label>
                            <Form.Control isInvalid={!!errors.city}
                                          defaultValue={props.address?.city}
                                          name="city"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.city}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 1</Form.Label>
                            <Form.Control isInvalid={!!errors.streetLine1}
                                          defaultValue={props.address?.streetLine1}
                                          name="streetLine1"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.streetLine1}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 2</Form.Label>
                            <Form.Control isInvalid={!!errors.streetLine2}
                                          defaultValue={props.address?.streetLine2}
                                          name="streetLine2"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.streetLine2}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Email</Form.Label>
                            <Form.Control isInvalid={!!errors.email}
                                          defaultValue={props.address?.email}
                                          name="email"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 1</Form.Label>
                            <Form.Control isInvalid={!!errors.phone1}
                                          defaultValue={props.address?.phone1}
                                          name="phone1"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.phone1}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 2</Form.Label>
                            <Form.Control isInvalid={!!errors.phone2}
                                          defaultValue={props.address?.phone2}
                                          name="phone2"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.phone2}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {isAdmin? <ButtonGroup>
                            {radios.map((radio, i) => (
                                <ToggleButton
                                    key={i}
                                    id={`radio-${i}`}
                                    type="radio"
                                    variant={i % 2 ? 'outline-success' : 'outline-danger'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup> : null}
                        {isAdmin? (radioValue === '1' ? <ViewSupplierOrCustomer title="Supplier" entities={suppliers} entity={props.address} valid={errors.supplier} isNew={isNew}/>
                            : <ViewSupplierOrCustomer title="Customer" entities={customers} entity={props.address} valid={errors.customer} isNew={isNew}/>) : null}
                        <Button className="d-block mx-auto" type="submit"  variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Form, Modal, ToggleButton} from "react-bootstrap";
import useEntitiesService from "../entities-service";
import {PencilFill, Plus} from "react-bootstrap-icons";

export const CreateOrUpdateAddress = (props) => {
    const [address, setAddress] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [radioValue, setRadioValue] = useState('1');
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const {loading, getEntities, error, clearError} = useEntitiesService();

    const radios = [
        { name: 'Supplier', value: '1' },
        { name: 'Customer', value: '2' }
    ];

    useEffect(() => {
        getEntities('suppliers', setSuppliers);
        getEntities('customers', setCustomers);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        if(!isNew) {
            props.address.customer? setRadioValue('2'): setRadioValue('1');
        }
        setShow(true);
        setAddress(props.address);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if(event.target.name === 'supplier') {
            setAddress({
                ...address,
                customer: null,
                supplier: suppliers.find(it => it.id == event.target.value)
            });
        }
        else if(event.target.name === 'customer') {
            setAddress({
                ...address,
                supplier: null,
                customer: customers.find(it => it.id == event.target.value)
            });
        }
        else {
            setAddress({...address, [event.target.name]: event.target.value});
        }
    }

    const handleSave = () => {
        isNew?  props.createAddress(address) : props.updateAddress(address, address.id);
        handleClose();
    }

    const viewSupplierOrCustomer = (title, entityName, entities, isSupplier) => {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="mt-3" >{title}</Form.Label>
                <Form.Select className="mb-3" name={entityName}>
                    <option>{isNew? (`Select ${title}`)
                        : (isSupplier? props.address.supplier?.name: props.address.customer?.name)}</option>
                    {
                        entities ? entities.map(entity =>
                            <option value={entity.id} key={entity.id}>{entity.name}</option>
                        ) : null
                    }
                </Form.Select>
            </Form.Group>
        );
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
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Country</Form.Label>
                            <Form.Control defaultValue={props.address?.country} name="country"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Province</Form.Label>
                            <Form.Control defaultValue={props.address?.province} name="province"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Post code</Form.Label>
                            <Form.Control defaultValue={props.address?.postCode} name="postCode"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >City</Form.Label>
                            <Form.Control defaultValue={props.address?.city} name="city"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 1</Form.Label>
                            <Form.Control defaultValue={props.address?.streetLine1} name="streetLine1"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Street line 2</Form.Label>
                            <Form.Control defaultValue={props.address?.streetLine2} name="streetLine2"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Email</Form.Label>
                            <Form.Control defaultValue={props.address?.email} name="email"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 1</Form.Label>
                            <Form.Control defaultValue={props.address?.phone1} name="phone1"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Phone 2</Form.Label>
                            <Form.Control defaultValue={props.address?.phone2} name="phone2"/>
                        </Form.Group>
                        <ButtonGroup>
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
                        </ButtonGroup>
                        {radioValue === '1' ? viewSupplierOrCustomer("Supplier", "supplier", suppliers, true)
                            : viewSupplierOrCustomer("Customer", "customer", customers, false)}
                        <Button className="d-block mx-auto"  onClick={handleSave} variant="primary" >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
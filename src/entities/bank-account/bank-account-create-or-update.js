import React, {useEffect, useState} from 'react';
import {PencilFill, Plus} from "react-bootstrap-icons";
import {Button, ButtonGroup, Form, Modal, ToggleButton} from "react-bootstrap";
import useEntitiesService from "../entities-service";

export const CreateOrUpdateBankAccount = (props) => {
    const [bankAccount, setBankAccount] = useState();
    const [addresses, setAddress] = useState([]);
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
        getEntities('addresses', setAddress);
        getEntities('suppliers', setSuppliers);
        getEntities('customers', setCustomers);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        if(!isNew) {
            props.bankAccount.customer? setRadioValue('2'): setRadioValue('1');
        }
        setShow(true);
        setBankAccount(props.bankAccount);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if(event.target.name === 'supplier') {
            setBankAccount({
                ...bankAccount,
                supplier: suppliers.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'customer') {
            setBankAccount({
                ...bankAccount,
                customer: customers.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'address') {
            setBankAccount({
                ...bankAccount,
                address: addresses.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else {
            setBankAccount({...bankAccount, [event.target.name]: event.target.value});
        }

    }

    const handleSave = () => {
        isNew?  props.createBankAccount(bankAccount) : props.updateBankAccount(bankAccount, bankAccount.id);
        handleClose();
    }

    const viewSupplierOrCustomer = (title, entityName, entities, isSupplier) => {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="mt-3" >{title}</Form.Label>
                <Form.Select className="mb-3" name={entityName}>
                    <option>{isNew? (`Select ${title}`)
                        : (isSupplier? props.bankAccount.supplier?.name: props.bankAccount.customer?.name)}</option>
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
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New bank account</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Bank Account' : `Edit Bank Account ${props.bankAccount?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.name} name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Account number</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.accountNumber} name="accountNumber"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Bank name</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.bankName} name="bankName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Swift</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.swift} name="swift"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent name</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.correspondentName} name="correspondentName"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent address</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.correspondentAddress} name="correspondentAddress"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent swift</Form.Label>
                            <Form.Control defaultValue={props.bankAccount?.correspondentSwift} name="correspondentSwift"/>
                        </Form.Group>
                        <Form.Label >Address</Form.Label>
                        <Form.Select className="mb-3" name="address">
                            <option>{props.bankAccount?.address? `${props.bankAccount.address.country}, ${props.bankAccount.address.city}, ${props.bankAccount.address.postCode}, ${props.bankAccount.address.streetLine1}` : 'Select Address'}</option>
                            {
                                addresses ? addresses.map(address =>
                                    <option value={address.id} key={address.id}> {`${address.country}, ${address.city}, ${address.postCode}, ${address.streetLine1}`}</option>
                                ) : null
                            }
                        </Form.Select>
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
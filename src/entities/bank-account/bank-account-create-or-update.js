import React, {useContext, useEffect, useState} from 'react';
import {PencilFill, Plus} from "react-bootstrap-icons";
import {Button, ButtonGroup, Form, Modal, ToggleButton} from "react-bootstrap";
import useEntitiesService from "../../services/entities-service";
import AuthContext from "../../context/auth-context";
import Validation from "../validation";
import ViewSupplierOrCustomer from "../../shared/layout/view/view-supplier-or-customer";

export const CreateOrUpdateBankAccount = (props) => {

    const [bankAccount, setBankAccount] = useState();
    const [addresses, setAddress] = useState([]);
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
        getEntities('addresses', setAddress, 0, user.username);
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
            props.bankAccount.customer? setRadioValue('2'): setRadioValue('1');
        }
        setShow(true);
        if(isAdmin) {
            setBankAccount({...props.bankAccount});
        } else {
            setBankAccount({...props.bankAccount, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if(event.target.name === "supplier" || event.target.name === "customer") {
            setBankAccount({
                ...bankAccount,
                supplier: event.target.name === "supplier"? suppliers.find(it => it.id.toString() === event.target.value.toString()) : null,
                customer: event.target.name === "customer"? customers.find(it => it.id.toString() === event.target.value.toString()) : null,
            });
        }
        if(event.target.name === 'address') {
            setBankAccount({
                ...bankAccount,
                address: addresses.find(it => it.id.toString() === event.target.value.toString())
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
            const supplier = isSupplier? suppliers.find(it => it.username === user.username) : bankAccount?.supplier;
            const customer = isCustomer? customers.find(it => it.username === user.username) : bankAccount?.customer;
            const bankAccountEntity = {
                ...bankAccount,
                ...values,
                supplier: supplier,
                customer: customer,
                address: bankAccount?.address
            }
            isNew?  props.createBankAccount(bankAccountEntity) : props.updateBankAccount(bankAccountEntity, bankAccountEntity.id);
            handleClose();
        }
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
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Name</Form.Label>
                            <Form.Control isInvalid={!!errors.name} defaultValue={props.bankAccount?.name} name="name"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Account number</Form.Label>
                            <Form.Control isInvalid={!!errors.accountNumber} defaultValue={props.bankAccount?.accountNumber} name="accountNumber"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.accountNumber}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Bank name</Form.Label>
                            <Form.Control isInvalid={!!errors.bankName} defaultValue={props.bankAccount?.bankName} name="bankName"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.bankName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Swift</Form.Label>
                            <Form.Control isInvalid={!!errors.swift} defaultValue={props.bankAccount?.swift} name="swift"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.swift}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent name</Form.Label>
                            <Form.Control isInvalid={!!errors.correspondentName} defaultValue={props.bankAccount?.correspondentName} name="correspondentName"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.correspondentName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent address</Form.Label>
                            <Form.Control isInvalid={!!errors.correspondentAddress} defaultValue={props.bankAccount?.correspondentAddress} name="correspondentAddress"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.correspondentAddress}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Correspondent swift</Form.Label>
                            <Form.Control isInvalid={!!errors.correspondentSwift} defaultValue={props.bankAccount?.correspondentSwift} name="correspondentSwift"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.correspondentSwift}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Address</Form.Label>
                            <Form.Select isInvalid={!!errors.address} className="mb-3" name="address">
                                <option>{props.bankAccount?.address? `${props.bankAccount.address.country}, ${props.bankAccount.address.city}, ${props.bankAccount.address.postCode}, ${props.bankAccount.address.streetLine1}` : 'Select Address'}</option>
                                {
                                    addresses ? addresses.map(address =>
                                        <option value={address.id} key={address.id}> {`${address.country}, ${address.city}, ${address.postCode}, ${address.streetLine1}`}</option>
                                    ) : null
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
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
                        </ButtonGroup> : null }
                        { isAdmin? (radioValue === '1' ? <ViewSupplierOrCustomer title="Supplier" entities={suppliers} entity={props.bankAccount} valid={errors.supplier} isNew={isNew}/>
                            : <ViewSupplierOrCustomer title="Customer" entities={customers} entity={props.bankAccount} valid={errors.customer} isNew={isNew}/>) : null}
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </div>
    );
}
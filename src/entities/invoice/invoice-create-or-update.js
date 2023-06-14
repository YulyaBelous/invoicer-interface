import React, {useContext, useEffect, useState} from "react";

import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import Validation from "../../utils/validation";
import AuthContext from "../../utils/auth-context";

export const CreateOrUpdateInvoice = (props) => {

    const [invoice, setInvoice] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {getEntities} = useEntitiesService();
    const {validation} = Validation();

    const {user, isAdmin, isCustomer} = useContext(AuthContext);

    useEffect(() => {
        getEntities('suppliers', setSuppliers, 0, user.username);
        getEntities('customers', setCustomers, 0, user.username);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        props.invoice?.supplier? handleChange("supplier", suppliers, props.invoice?.supplier) : handleChange();
        props.invoice?.customer? handleChange("customer", customers, props.invoice?.customer) : handleChange();
        if(isAdmin) {
            setInvoice({...props.invoice});
        } else {
            setInvoice({...props.invoice, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

   const handleChange = (event, entities, invoiceValue) => {
       const value = event?.target? event?.target.value : invoiceValue?.id;
       const entity = event?.target? event.target.name : event;
       setInvoice({
           ...invoice,
           [entity]: entities?.find(it => it.id.toString() === value?.toString())
       })
       if ( !!errors[entity] ) setErrors({...errors, [entity]: null})
    }

    const setField = (e) => {
       setInvoice({...invoice, [e.target.name] : e.target.value});
        if ( !!errors[e.target.name] ) setErrors({...errors, [e.target.name]: null})
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            if(isNew) {
                props.createInvoice(invoice);
            } else {
                props.updateInvoice(invoice, invoice.id);
            }
            handleClose();
        }
    }

    const viewAddressOrBank = (title, entityName, entities, entity, isAddress, isSupplier, valid) => {
        let disabledSupplier = true, disabledCustomer = true;
        if(invoice?.supplier != null) {
            disabledSupplier = false;
        }
        if (invoice?.customer != null) {
            disabledCustomer = false;
        }
        return (
            <Form.Group className="mb-3">
                <Form.Label >{title}</Form.Label>
                <Form.Select disabled={isSupplier? disabledSupplier : disabledCustomer} onChange={(e) => handleChange(e, entities)} isInvalid={!!valid} name={entityName}>
                    <option>{ entity? (isAddress? `${entity?.country}, ${entity?.city}, ${entity?.postCode}, ${entity?.streetLine1}` : entity?.bankName) : (`Select ${title}`)}</option>
                    {
                        isAddress? (entities ? entities.map(address =>
                            <option value={address?.id} key={address.id}>{`${address.country}, ${address.city}, ${address.postCode}, ${address.streetLine1}`}</option>
                        ) : null)
                        : (entities ? entities.map(account =>
                        <option value={account.id} key={account.id}>{account.bankName}</option>
                        ) : null)
                    }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {valid}
                </Form.Control.Feedback>
            </Form.Group>
        )
    }

    return (
        <div>
            {isNew? (!isCustomer? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary">
                    <Plus size={29}/> New invoice </Button> : null)
                : (<Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>)}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Invoice' : `Edit Invoice ${props.invoice?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Number</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.number}
                                defaultValue={props.invoice?.number}
                                name="number"
                                placeholder="Number" />
                            <Form.Control.Feedback type="invalid">
                                { errors.number }
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Date</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.date}
                                defaultValue={props.invoice?.date}
                                type="date"
                                name="date"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.date}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Description</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.description}
                                defaultValue={props.invoice?.description}
                                name="description"
                                placeholder="Description"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Price</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.unitPrice}
                                defaultValue={props.invoice?.unitPrice}
                                type="number"
                                step={0.1}
                                name="unitPrice"
                                placeholder="Price"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.unitPrice}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Quantity</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.quantity}
                                defaultValue={props.invoice?.quantity}
                                type="number"
                                name="quantity"
                                placeholder="Quantity"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.quantity}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Amount</Form.Label>
                            <Form.Control
                                onChange={setField}
                                isInvalid={!!errors.amount}
                                defaultValue={props.invoice?.amount}
                                type="number"
                                step={0.1}
                                name="amount"
                                placeholder="Amount"/>
                            <Form.Control.Feedback type="invalid">
                                {errors.amount}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Supplier</Form.Label>
                            <Form.Select onChange={(e) => handleChange(e, suppliers)} isInvalid={!!errors.supplier} name="supplier">
                                <option>{props.invoice?.supplier? props.invoice.supplier.name: 'Select Supplier'} </option>
                                {
                                    suppliers ? suppliers.map(supplier =>
                                        <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                                    ) : null
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.supplier}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {viewAddressOrBank("Address Supplier", "addressSupplier", invoice?.supplier?.addresses, invoice?.addressSupplier, true, true, errors.addressSupplier)}
                        {viewAddressOrBank("Bank Account Supplier", "bankAccountSupplier", invoice?.supplier?.bankAccounts, invoice?.bankAccountSupplier, false, true, errors.bankAccountSupplier)}
                        <Form.Group className="mb-3">
                            <Form.Label >Customer</Form.Label>
                            <Form.Select onChange={(e) => handleChange(e, customers)} isInvalid={!!errors.customer} name="customer">
                                <option>{props.invoice?.customer? props.invoice.customer.name: 'Select Customer'} </option>
                                {
                                    customers ? customers.map(customer =>
                                        <option value={customer.id} key={customer.id}>{customer.name}</option>
                                    ) : null
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.customer}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {viewAddressOrBank("Address Customer", "addressCustomer", invoice?.customer?.addresses, props.invoice?.addressCustomer, true, false, errors.addressCustomer)}
                        {viewAddressOrBank("Bank Account Customer", "bankAccountCustomer", invoice?.customer?.bankAccounts, props.invoice?.bankAccountCustomer, false, false, errors.bankAccountCustomer)}
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
import React, {useEffect, useState} from "react";

import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import Validation from "../validation";

export const CreateOrUpdateInvoice = (props) => {

    const [invoice, setInvoice] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);

    const [addressFiltered, setAddressFiltered] = useState([]);
    const [bankFiltered, setBankFiltered] = useState([]);

    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({})

    const {getEntities} = useEntitiesService();
    const {validation} = Validation();

    const username = JSON.parse(localStorage.getItem("user")).username;

    useEffect(() => {
        getEntities('suppliers', setSuppliers, 0, username);
        getEntities('customers', setCustomers, 0, username);
        getEntities('addresses', setAddresses, 0, username);
        getEntities('bank-accounts', setBankAccounts, 0, username);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        props.invoice?.supplier? changeSuppOrCus(null, suppliers, "supplier", props.invoice?.supplier) : changeSuppOrCus();
        props.invoice?.customer? changeSuppOrCus(null, customers, "customer", props.invoice?.customer) : changeSuppOrCus();
        if(props.isAdmin) {
            setInvoice({...props.invoice});
        } else {
            setInvoice({...props.invoice, username : username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

   const handleChange = (event, entity) => {
        setInvoice({
            ...invoice,
            [event.target.name] : entity?.find(it => it.id.toString() === event.target.value.toString())
        })
        if ( !!errors[event.target.name] ) setErrors({...errors, [event.target.name]: null})
    }

    const changeSuppOrCus = (event, entities, entity, invoiceValue) => {
        const value = event?.target? event?.target?.value : invoiceValue?.id;
        let idEntity = entities?.find(it => it.id.toString() === value?.toString())?.id;
        setAddressFiltered(addresses.filter(item => item[entity]? item[entity].id === idEntity : null));
        setBankFiltered(bankAccounts.filter(item => item[entity]? item[entity].id === idEntity : null));
        setInvoice({
            ...invoice,
            [entity]: entities?.find(it => it.id.toString() === value?.toString())
        })
        if ( !!errors[event?.target.name] ) setErrors({...errors, [event?.target.name]: null})
    }

    const setField = (e) => {
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
            let idSupplier, idCustomer;
            invoice?.supplier?.id? idSupplier = invoice?.supplier?.id : idSupplier = invoice?.supplier;
            invoice?.customer?.id? idCustomer = invoice?.customer?.id : idCustomer = invoice?.customer;
            const invoiceEntity = {
                ...invoice,
                ...values,
                supplier: suppliers.find(it => it.id.toString() === idSupplier?.toString()),
                customer: customers.find(it => it.id.toString() === idCustomer?.toString()),
                addressSupplier: addresses.find(it => it.id.toString() === invoice?.addressSupplier?.id.toString()),
                addressCustomer: addresses.find(it => it.id.toString() === invoice?.addressCustomer?.id.toString()),
                bankAccountSupplier: bankAccounts.find(it => it.id.toString() === invoice?.bankAccountSupplier?.id.toString()),
                bankAccountCustomer: bankAccounts.find(it => it.id.toString() === invoice?.bankAccountCustomer?.id.toString())
            }
            if(isNew) {
                props.createInvoice(invoiceEntity);
            } else {
                props.updateInvoice(invoiceEntity, invoiceEntity.id);
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
                <Form.Select disabled={isSupplier? disabledSupplier : disabledCustomer} onChange={(e) => handleChange(e, entities)}  isInvalid={!!valid} name={entityName}>
                    <option>{ entity? (isAddress? `${entity?.country}, ${entity?.city}, ${entity?.postCode}, ${entity?.streetLine1}` : entity?.bankName) : (`Select ${title}`)}</option>
                    {
                        isAddress? (addressFiltered ? addressFiltered.map(address =>
                            <option value={address?.id} key={address.id}>{`${address.country}, ${address.city}, ${address.postCode}, ${address.streetLine1}`}</option>
                        ) : null)
                        : (bankFiltered ? bankFiltered.map(account =>
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
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New invoice</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new Invoice' : `Edit Invoice ${props.invoice?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form  onSubmit={e => handleSave(e)}>
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
                            <Form.Select onChange={(e) => changeSuppOrCus(e, suppliers, "supplier")} isInvalid={!!errors.supplier} name="supplier">
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
                        {viewAddressOrBank("Address Supplier", "addressSupplier", addresses, invoice?.addressSupplier, true, true, errors.addressSupplier)}
                        {viewAddressOrBank("Bank Account Supplier", "bankAccountSupplier", bankAccounts, invoice?.bankAccountSupplier, false, true, errors.bankAccountSupplier)}
                        <Form.Group className="mb-3">
                            <Form.Label >Customer</Form.Label>
                            <Form.Select onChange={(e) => changeSuppOrCus(e, customers, "customer")} isInvalid={!!errors.customer} name="customer">
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
                        {viewAddressOrBank("Address Customer", "addressCustomer", addresses, props.invoice?.addressCustomer, true, false, errors.addressCustomer)}
                        {viewAddressOrBank("Bank Account Customer", "bankAccountCustomer", bankAccounts, props.invoice?.bankAccountCustomer, false, false, errors.bankAccountCustomer)}
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
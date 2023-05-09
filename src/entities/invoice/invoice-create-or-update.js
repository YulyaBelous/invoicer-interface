import React, {useEffect, useState} from "react";

import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

import useEntitiesService from "../entities-service";

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
    const [validated, setValidated] = useState(false);

    const {getEntities} = useEntitiesService();

    useEffect(() => {
        getEntities('suppliers', setSuppliers);
        getEntities('customers', setCustomers);
        getEntities('addresses', setAddresses);
        getEntities('bank-accounts', setBankAccounts);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        props.invoice?.supplier? handleChangeSupplier(null, props.invoice?.supplier) : handleChangeSupplier(null);
        props.invoice?.customer? handleChangeCustomer(null, props.invoice?.customer) : handleChangeCustomer(null);
        setInvoice({...props.invoice});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChangeSupplier = (event, invoiceValue) => {
        const value = event?.target? event?.target?.value : invoiceValue?.id;
        let idEntity = suppliers.find(it => it.id.toString() === value?.toString())?.id;
        setAddressFiltered(addresses.filter(item => item.supplier? item.supplier.id === idEntity : null));
        setBankFiltered(bankAccounts.filter(item => item.supplier? item.supplier.id === idEntity : null));
        setInvoice({
            ...invoice,
            supplier: suppliers.find(it => it.id.toString() === value?.toString())
        })
    }

    const handleChangeCustomer = (event, invoiceValue) => {
        const value = event?.target? event?.target?.value : invoiceValue?.id;
        let idEntity = customers.find(it => it.id.toString() === value?.toString())?.id;
        setAddressFiltered(addresses.filter(item => item.customer? item.customer.id === idEntity : null));
        setBankFiltered(bankAccounts.filter(item => item.customer? item.customer.id === idEntity : null));
        setInvoice({
            ...invoice,
            customer: customers.find(it => it.id.toString() === value?.toString())
        })
    }

    const handleChange = (event, entity) => {
        setInvoice({
            ...invoice,
            [event.target.name] : entity?.find(it => it.id.toString() === event.target.value.toString())
        })
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
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


    const viewAddressOrBank = (title, entityName, entities, entity, isAddress, isSupplier) => {
        let disabledSupplier = true, disabledCustomer = true;
        if(invoice?.supplier != null) {
            disabledSupplier = false;
        }
        if (invoice?.customer != null) {
            disabledCustomer = false;
        }
        return (
            <>
                <Form.Label >{title}</Form.Label>
                <Form.Select disabled={isSupplier? disabledSupplier : disabledCustomer} onChange={(e) => handleChange(e, entities)} className="mb-3" name={entityName}>
                    <option>{ entity? (isAddress? `${entity?.country}, ${entity?.city}, ${entity?.postCode}, ${entity?.streetLine1}` : entity?.bankName) : (`Select ${title}`)}</option>
                    {
                        isAddress? (addressFiltered ? addressFiltered.map(address =>
                            <option value={address?.id} key={address.id}>{`${address.country}, ${address.city}, ${address.postCode}, ${address.streetLine1}`}</option>
                        ) : null)
                        : (bankFiltered ? bankFiltered.map(account =>
                        <option value={account?.id} key={account.id}>{account.bankName}</option>
                        ) : null)
                    }
                </Form.Select>
            </>
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
                    <Form noValidate validated={validated} onSubmit={e => handleSave(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label >Number</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.number} name="number" placeholder="Number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Date</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.date} type="date" name="date"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Description</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.description} name="description" placeholder="Description"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Price</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.unitPrice} name="unitPrice" placeholder="Price"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Quantity</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.quantity} name="quantity" placeholder="Quantity"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Amount</Form.Label>
                            <Form.Control required defaultValue={props.invoice?.amount} name="amount" placeholder="Amount"/>
                        </Form.Group>
                        <Form.Label >Supplier</Form.Label>
                        <Form.Select onChange={handleChangeSupplier} className="mb-3" name="supplier">
                            <option>{props.invoice?.supplier? props.invoice.supplier.name: 'Select Supplier'} </option>
                            {
                                suppliers ? suppliers.map(supplier =>
                                    <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                                ) : null
                            }
                        </Form.Select>
                        {viewAddressOrBank("Address Supplier", "addressSupplier", addresses, invoice?.addressSupplier, true, true)}
                        {viewAddressOrBank("Bank Account Supplier", "bankAccountSupplier", bankAccounts, invoice?.bankAccountSupplier, false, true)}
                        <Form.Label >Customer</Form.Label>
                        <Form.Select onChange={handleChangeCustomer} className="mb-3" name="customer">
                            <option>{props.invoice?.customer? props.invoice.customer.name: 'Select Customer'} </option>
                            {
                                customers ? customers.map(customer =>
                                    <option value={customer.id} key={customer.id}>{customer.name}</option>
                                ) : null
                            }
                        </Form.Select>
                        {viewAddressOrBank("Address Customer", "addressCustomer", addresses, props.invoice?.addressCustomer, true, false)}
                        {viewAddressOrBank("Bank Account Customer", "bankAccountCustomer", bankAccounts, props.invoice?.bankAccountCustomer, false, false)}
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
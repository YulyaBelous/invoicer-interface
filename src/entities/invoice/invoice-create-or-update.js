import React, {useEffect, useState} from "react";
import useEntitiesService from "../entities-service";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

export const CreateOrUpdateInvoice = (props) => {
    const [invoice, setInvoice] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [addressFiltered, setAddressFiltered] = useState([]);
    const [bankFiltered, setBankFiltered] = useState([]);
    const [validated, setValidated] = useState(false);
    const {loading, getEntities, error, clearError} = useEntitiesService();
    let idEntity;

    useEffect(() => {
        getEntities('suppliers', setSuppliers);
        getEntities('customers', setCustomers);
        getEntities('addresses', setAddresses);
        getEntities('bank-accounts', setBankAccounts);
        setIsNew(props.isNew);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        setInvoice({...props.invoice, supplier: props.invoice?.supplier?.id, customer: props.invoice?.customer?.id});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChangeSupplier = (event) => {
        idEntity = suppliers.find(it => it.id.toString() == event.target.value.toString())?.id;
        setAddressFiltered(addresses.filter(item => item.supplier? item.supplier.id === idEntity : null));
        setBankFiltered(bankAccounts.filter(item => item.supplier? item.supplier.id === idEntity : null));
    }

    const handleChangeCustomer = (event) => {
        idEntity = customers.find(it => it.id.toString() == event.target.value.toString())?.id;
        setAddressFiltered(addresses.filter(item => item.customer? item.customer.id === idEntity : null));
        setBankFiltered(bankAccounts.filter(item => item.customer? item.customer.id === idEntity : null));
    }

    const handleChange = (event) => {
        if(event.target.name === "addressSupplier" || event.target.name === "addressCustomer") {
            setInvoice({
                ...invoice,
                [event.target.name] : addresses?.find(it => it.id.toString() === event.target.value.toString())
            })
        } else {
            setInvoice({
                ...invoice,
                [event.target.name] : bankAccounts?.find(it => it.id.toString() === event.target.value.toString())
            })
        }
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const invoiceEntity = {
            ...invoice,
            ...values,
            supplier: suppliers.find(it => it.id.toString() === invoice?.supplier? invoice?.supplier?.toString() : values.supplier?.toString()),
            customer: customers.find(it => it.id.toString() === invoice?.customer? invoice?.customer?.toString() : values.customer?.toString()),
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

    const viewAddressOrBank = (title, entityName, entity, isAddress) => {
        return (
            <>
                <Form.Label >{title}</Form.Label>
                <Form.Select onChange={handleChange} className="mb-3" name={entityName}>
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
                        {viewAddressOrBank("Address Supplier", "addressSupplier", invoice?.addressSupplier, true)}
                        {viewAddressOrBank("Bank Account Supplier", "bankAccountSupplier", invoice?.bankAccountSupplier, false)}
                        <Form.Label >Customer</Form.Label>
                        <Form.Select onChange={handleChangeCustomer} className="mb-3" name="customer">
                            <option>{props.invoice?.customer? props.invoice.customer.name: 'Select Customer'} </option>
                            {
                                customers ? customers.map(customer =>
                                    <option value={customer.id} key={customer.id}>{customer.name}</option>
                                ) : null
                            }
                        </Form.Select>
                        {viewAddressOrBank("Address Customer", "addressCustomer", props.invoice?.addressCustomer, true)}
                        {viewAddressOrBank("Bank Account Customer", "bankAccountCustomer", props.invoice?.bankAccountCustomer, false)}
                        <Button className="d-block mx-auto" type="submit" variant="primary" >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
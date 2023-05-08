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
    const [isSelectSupplier, setIsSelectSupplier] = useState(false);
    const [isSelectCustomer, setIsSelectCustomer] = useState(false);
    const [addressFiltered, setAddressFiltered] = useState([]);
    const [bankFiltered, setBankFiltered] = useState([]);
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
        if(!isNew) {
            props.invoice?.supplier? setIsSelectSupplier(true) : setIsSelectSupplier(false);
            props.invoice?.customer? setIsSelectCustomer(true) : setIsSelectCustomer(false);
        }
        setShow(true);
        setInvoice(props.invoice);
    };

    const handleClose = () => {
        setShow(false);
    };

    const filterEntity = (entities, addresses, bankAccounts, setSelect, event, isSupplier) => {
        idEntity = entities.find(it => it.id.toString() == event.target.value.toString());
        setAddressFiltered(addresses.filter(item => isSupplier? (item.supplier? item.supplier.id === idEntity.id : null)
            : (item.customer? item.customer.id === idEntity.id : null)));
        setBankFiltered(bankAccounts.filter(item => isSupplier? (item.supplier? item.supplier.id === idEntity.id : null)
            : (item.customer? item.customer.id === idEntity.id : null)));
        setSelect(true);
    }

    const handleChange = (event) => {
        if(event.target.name === 'supplier') {
            filterEntity(suppliers, addresses, bankAccounts, setIsSelectSupplier, event, true);
            setInvoice({
                ...invoice,
                supplier: suppliers.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'customer') {
            filterEntity(customers, addresses, bankAccounts, setIsSelectCustomer, event, false);
            setInvoice({
                ...invoice,
                customer: customers.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'addressSupplier') {
            setInvoice({
                ...invoice,
                addressSupplier: addresses.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'addressCustomer') {
            setInvoice({
                ...invoice,
                addressCustomer: addresses.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'bankAccountSupplier') {
            setInvoice({
                ...invoice,
                bankAccountSupplier: bankAccounts.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else if(event.target.name === 'bankAccountCustomer') {
            setInvoice({
                ...invoice,
                bankAccountCustomer: bankAccounts.find(it => it.id.toString() === event.target.value.toString())
            });
        }
        else {
            setInvoice({
                ...invoice,
                [event.target.name]: event.target.value,
            });
        }
    }
    const handleSave = () => {
        console.log(invoice);
        isNew?  props.createInvoice(invoice) : props.updateInvoice(invoice, invoice.id);
        handleClose();
    }

    const viewAddressOrBank = (title, entityName, entity, isAddress) => {
        return (
            <>
                <Form.Label >{title}</Form.Label>
                <Form.Select className="mb-3" name={entityName}>
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
                    <Form onChange={handleChange} >
                        <Form.Group className="mb-3">
                            <Form.Label >Number</Form.Label>
                            <Form.Control defaultValue={props.invoice?.number} name="number"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Date</Form.Label>
                            <Form.Control defaultValue={props.invoice?.date} type="date" name="date"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Description</Form.Label>
                            <Form.Control defaultValue={props.invoice?.description} name="description"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Price</Form.Label>
                            <Form.Control defaultValue={props.invoice?.unitPrice} name="unitPrice"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Quantity</Form.Label>
                            <Form.Control defaultValue={props.invoice?.quantity} name="quantity"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >Amount</Form.Label>
                            <Form.Control defaultValue={props.invoice?.amount} name="amount"/>
                        </Form.Group>
                        <Form.Label >Supplier</Form.Label>
                        <Form.Select  className="mb-3" name="supplier">
                            <option>{props.invoice?.supplier? props.invoice.supplier.name: 'Select Supplier'} </option>
                            {
                                suppliers ? suppliers.map(supplier =>
                                    <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                                ) : null
                            }
                        </Form.Select>
                        {isSelectSupplier ? viewAddressOrBank("Address Supplier", "addressSupplier", props.invoice?.addressSupplier, true) : null}
                        {isSelectSupplier ? viewAddressOrBank("Bank Account Supplier", "bankAccountSupplier", props.invoice?.bankAccountSupplier, false) : null}
                        <Form.Label >Customer</Form.Label>
                        <Form.Select className="mb-3" name="customer">
                            <option>{props.invoice?.customer? props.invoice.customer.name: 'Select Customer'} </option>
                            {
                                customers ? customers.map(customer =>
                                    <option value={customer.id} key={customer.id}>{customer.name}</option>
                                ) : null
                            }
                        </Form.Select>
                        {isSelectCustomer? viewAddressOrBank("Address Customer", "addressCustomer", props.invoice?.addressCustomer, true) : null}
                        {isSelectCustomer? viewAddressOrBank("Bank Account Customer", "bankAccountCustomer", props.invoice?.bankAccountCustomer, false) : null}
                        <Button className="d-block mx-auto"  onClick={handleSave} variant="primary" >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
import React, {useContext, useEffect, useState} from "react";

import {Button, Form} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import Validation from "../../utils/validation";
import AuthContext from "../../utils/auth-context";
import renderFormGroup from "../../shared/components/render-form-group";
import RenderFormSelect from "../../shared/components/render-form-select";
import EntityModal from "../../shared/components/entity-modal";

export const CreateOrUpdateInvoice = (props) => {

    const [newInvoice, setNewInvoice] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});

    const {getEntities} = useEntitiesService();
    const {validation} = Validation();

    const {user, isAdmin, isCustomer} = useContext(AuthContext);
    const {isNew, invoice, createInvoice, updateInvoice} = props;

    useEffect(() => {
        getEntities('suppliers', setSuppliers);
        getEntities('customers', setCustomers);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        invoice?.supplier? handleChange("supplier", suppliers, invoice?.supplier) : handleChange();
        invoice?.customer? handleChange("customer", customers, invoice?.customer) : handleChange();
        if(isAdmin) {
            setNewInvoice({...props.invoice});
        } else {
            setNewInvoice({...props.invoice, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

   const handleChange = (event, entities, invoiceValue) => {
       const value = event?.target? event?.target.value : invoiceValue?.id;
       const entity = event?.target? event.target.name : event;
       setNewInvoice({
           ...newInvoice,
           [entity]: entities?.find(it => it.id.toString() === value?.toString())
       })
    }

    const setFieldError = (e) => {
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
            const invoiceEntity = {
                ...newInvoice,
                ...values,
                supplier: newInvoice?.supplier,
                customer: newInvoice?.customer,
                addressSupplier: newInvoice?.addressSupplier,
                bankAccountSupplier: newInvoice?.bankAccountSupplier,
                addressCustomer: newInvoice?.addressCustomer,
                bankAccountCustomer: newInvoice?.bankAccountCustomer
            }
            if(isNew) {
                createInvoice(invoiceEntity);
            } else {
                updateInvoice(invoiceEntity, newInvoice?.id);
            }
            handleClose();
        }
    }

    return (
        <div>
            {isNew? (!isCustomer? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary">
                    <Plus size={29}/> New invoice </Button> : null)
                : (<Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>)}
            <EntityModal show={show} handleClose={handleClose} title={isNew? 'Create a new Invoice' : `Edit Invoice ${invoice?.id}`}>
                <Form onChange={setFieldError} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Number", "number", invoice?.number, errors.number)}
                    {renderFormGroup("Date", "date", invoice?.date, errors.date, "date")}
                    {renderFormGroup("Description", "description", invoice?.description, errors.description)}
                    {renderFormGroup("Price", "unitPrice", invoice?.unitPrice, errors.unitPrice, "number",  0.1)}
                    {renderFormGroup("Quantity", "quantity",  invoice?.quantity, errors.quantity, "number")}
                    {renderFormGroup("Amount", "amount", invoice?.amount, errors.amount, "number",  0.1)}
                    <RenderFormSelect
                        label="Supplier"
                        name="supplier"
                        error={errors.supplier}
                        entities={suppliers}
                        isNew={isNew}
                        value={props.invoice?.supplier?.name}
                        onChange={e => handleChange(e, suppliers)}
                    />
                    <RenderFormSelect
                        label="Address Supplier"
                        name="addressSupplier"
                        error={errors.addressSupplier}
                        entities={newInvoice?.supplier?.addresses}
                        isNew={isNew}
                        value={`${newInvoice?.addressSupplier?.country}, ${newInvoice?.addressSupplier?.city}, 
                                ${newInvoice?.addressSupplier?.postCode}, ${newInvoice?.addressSupplier?.streetLine1}`}
                        onChange={e => handleChange(e, newInvoice?.supplier?.addresses)}
                        disabled={newInvoice?.supplier == null}
                    />
                    <RenderFormSelect
                        label="Bank Account Supplier"
                        name="bankAccountSupplier"
                        error={errors.bankAccountSupplier}
                        entities={newInvoice?.supplier?.bankAccounts}
                        isNew={isNew}
                        value={newInvoice?.bankAccountSupplier?.bankName}
                        onChange={e => handleChange(e, newInvoice?.supplier?.bankAccounts)}
                        disabled={newInvoice?.supplier == null}
                    />
                    <RenderFormSelect
                        label="Customer"
                        name="customer"
                        error={errors.customer}
                        entities={customers}
                        isNew={isNew}
                        value={props.invoice?.customer?.name}
                        onChange={e => handleChange(e, customers)}
                    />
                    <RenderFormSelect
                        label="Address Customer"
                        name="addressCustomer"
                        error={errors.addressCustomer}
                        entities={newInvoice?.customer?.addresses}
                        isNew={isNew}
                        value={`${newInvoice?.addressCustomer?.country}, ${newInvoice?.addressCustomer?.city}, 
                                ${newInvoice?.addressCustomer?.postCode}, ${newInvoice?.addressCustomer?.streetLine1}`}
                        onChange={e => handleChange(e, newInvoice?.customer?.addresses)}
                        disabled={newInvoice?.customer == null}
                    />
                    <RenderFormSelect
                        label="Bank Account Customer"
                        name="bankAccountCustomer"
                        error={errors.bankAccountCustomer}
                        entities={newInvoice?.customer?.bankAccounts}
                        isNew={isNew}
                        value={newInvoice?.bankAccountCustomer?.bankName}
                        onChange={e => handleChange(e, newInvoice?.customer?.bankAccounts)}
                        disabled={newInvoice?.customer == null}
                    />
                    <Button className="d-block mx-auto" type="submit" variant="primary" > Save </Button>
                </Form>
            </EntityModal>
        </div>
    );
}
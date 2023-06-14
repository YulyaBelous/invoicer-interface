import React, {useContext, useEffect, useState} from 'react';
import {PencilFill, Plus} from "react-bootstrap-icons";
import {Button, Form} from "react-bootstrap";
import useEntitiesService from "../../services/entities-service";
import AuthContext from "../../utils/auth-context";
import Validation from "../../utils/validation";
import EntityModal from "../../shared/components/entity-modal";
import renderFormGroup from "../../shared/components/render-form-group";
import RenderFormSelect from "../../shared/components/render-form-select";
import RadioButtons from "../../shared/components/radio-buttons";

export const CreateOrUpdateBankAccount = (props) => {

    const { isNew, bankAccount, createBankAccount, updateBankAccount } = props;
    const { user, isAdmin, isSupplier, isCustomer } = useContext(AuthContext);

    const [newBankAccount, setNewBankAccount] = useState();
    const [addresses, setAddress] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [radioValue, setRadioValue] = useState('1');

    const { getEntities } = useEntitiesService();
    const { validation } = Validation();

    useEffect(() => {
        getEntities('addresses', setAddress, 0, user.username);
        if (isAdmin || isSupplier) {
            getEntities('suppliers', setSuppliers, 0, user.username);
        }
        if (isAdmin || isCustomer) {
            getEntities('customers', setCustomers, 0, user.username);
        }
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        if (!isNew) {
            bankAccount.customer ? setRadioValue('2') : setRadioValue('1');
        }
        if (isAdmin) {
            setNewBankAccount({ ...bankAccount });
        } else {
            setNewBankAccount({ ...bankAccount, username: user.username });
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'supplier' || name === 'customer') {
            setNewBankAccount({
                ...newBankAccount,
                supplier: name === 'supplier'? suppliers.find((it) => it.id.toString() === value.toString()) : null,
                customer: name === 'customer'? customers.find((it) => it.id.toString() === value.toString()) : null,
            });
        }
        if (name === 'address') {
            setNewBankAccount({
                ...newBankAccount,
                address: addresses.find((it) => it.id.toString() === value.toString()),
            });
        }
        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const supplier = isSupplier ? suppliers.find((it) => it.username === user.username) : newBankAccount?.supplier;
            const customer = isCustomer? customers.find((it) => it.username === user.username) : newBankAccount?.customer;
            const bankAccountEntity = {
                ...newBankAccount,
                ...values,
                supplier: supplier,
                customer: customer,
                address: newBankAccount?.address,
            };
            isNew? createBankAccount(bankAccountEntity) : updateBankAccount(bankAccountEntity, bankAccountEntity.id);
            handleClose();
        }
    };

    return (
        <div>
            {isNew ? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary">
                    <Plus size={29} /> New bank account </Button>
             :  <Button onClick={handleClickOpen} variant="primary"> <PencilFill /> </Button> }

            <EntityModal show={show} handleClose={handleClose} title={isNew ? 'Create a new Bank Account' : `Edit Bank Account ${props.bankAccount?.id}`}>
                <Form onChange={handleChange} onSubmit={handleSave}>
                    {renderFormGroup('Name', 'name', bankAccount?.name, errors.name)}
                    {renderFormGroup('Account number','accountNumber', bankAccount?.accountNumber, errors.accountNumber)}
                    {renderFormGroup('Bank name', 'bankName', bankAccount?.bankName, errors.bankName)}
                    {renderFormGroup('Swift', 'swift', bankAccount?.swift, errors.swift)}
                    {renderFormGroup('Correspondent name','correspondentName', bankAccount?.correspondentName, errors.correspondentName)}
                    {renderFormGroup('Correspondent address','correspondentAddress', bankAccount?.correspondentAddress, errors.correspondentAddress)}
                    {renderFormGroup('Correspondent swift','correspondentSwift', bankAccount?.correspondentSwift, errors.correspondentSwift)}
                    <RenderFormSelect
                        entities={addresses}
                        name="address"
                        label="Address"
                        value={`${bankAccount?.address.country}, ${bankAccount?.address.city}, ${bankAccount?.address.postCode}, ${bankAccount?.address.streetLine1}`}
                        error={errors.address}
                        isNew={isNew}
                    />
                    {isAdmin ? <RadioButtons radioValue={radioValue} setRadioValue={setRadioValue} /> : null}
                    {isAdmin &&
                        <RenderFormSelect
                            entities={radioValue === '1' ? suppliers : customers}
                            name={radioValue === '1' ? 'supplier' : 'customer'}
                            label={radioValue === '1' ? 'Supplier' : 'Customer'}
                            value={radioValue === '1' ? bankAccount?.supplier?.name : bankAccount?.customer?.name}
                            error={radioValue === '1' ? errors.supplier : errors.customer}
                            isNew={isNew}
                        />
                    }
                    <Button className="d-block mx-auto" type="submit" variant="primary"> Save </Button>
                </Form>
            </EntityModal>
        </div>
    );
};
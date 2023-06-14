import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import useEntitiesService from "../../services/entities-service";
import {PencilFill, Plus} from "react-bootstrap-icons";
import AuthContext from "../../utils/auth-context";
import Validation from "../../utils/validation";
import RenderFormSelect from "../../shared/components/render-form-select";
import renderFormGroup from "../../shared/components/render-form-group";
import EntityModal from "../../shared/components/entity-modal";
import RadioButtons from "../../shared/components/radio-buttons";
export const CreateOrUpdateAddress = (props) => {

    const [newAddress, setNewAddress] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [radioValue, setRadioValue] = useState('1');
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});

    const {getEntities} = useEntitiesService();
    const {validation} = Validation();

    const {user, isAdmin, isSupplier, isCustomer} = useContext(AuthContext);
    const {isNew, address, createAddress, updateAddress} = props;

    useEffect(() => {
        if(isAdmin || isSupplier) {
            getEntities('suppliers', setSuppliers, 0, user.username);
        }
        if(isAdmin || isCustomer) {
            getEntities('customers', setCustomers, 0, user.username);
        }
    }, []);

    const handleClickOpen = () => {
        if(!isNew) {
            address.customer? setRadioValue('2'): setRadioValue('1');
        }
        setShow(true);
        if(isAdmin) {
            setNewAddress({...address});
        } else {
            setNewAddress({...address, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        if(name === "supplier" || name === "customer") {
            setNewAddress({
                ...newAddress,
                supplier: name === "supplier"? suppliers.find(it => it.id.toString() === value.toString()) : null,
                customer: name === "customer"? customers.find(it => it.id.toString() === value.toString()) : null,
            });
        }
        if ( !!errors[name] ) setErrors({...errors, [name]: null})
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            const supplier = isSupplier? suppliers.find(it => it.username === user.username) : newAddress?.supplier;
            const customer = isCustomer? customers.find(it => it.username === user.username) : newAddress?.customer;
            const addressEntity = {
                ...newAddress,
                ...values,
                supplier: supplier,
                customer: customer
            }
            isNew?  createAddress(addressEntity) : updateAddress(addressEntity, addressEntity.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New address</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <EntityModal show={show} handleClose={handleClose} title={isNew? 'Create a new Address' : `Edit Address ${address?.id}`}>
                <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Country", "country", address?.country, errors.country)}
                    {renderFormGroup("Province", "province", address?.province, errors.province)}
                    {renderFormGroup("Post code", "postCode", address?.postCode, errors.postCode)}
                    {renderFormGroup("City", "city", address?.city, errors.city)}
                    {renderFormGroup("Street line 1", "streetLine1", address?.streetLine1, errors.streetLine1)}
                    {renderFormGroup("Street line 2", "streetLine2", address?.streetLine2, errors.streetLine2)}
                    {renderFormGroup("Email", "email", address?.email, errors.email)}
                    {renderFormGroup("Phone 1", "phone1", address?.phone1, errors.phone1)}
                    {renderFormGroup("Phone 2", "phone2", address?.phone2, errors.phone2)}
                    {isAdmin? <RadioButtons radioValue={radioValue} setRadioValue={setRadioValue}/> : null}
                    {isAdmin? (radioValue === '1' ?
                        <RenderFormSelect
                            label="Supplier"
                            name="supplier"
                            entities={suppliers}
                            value={address?.supplier?.name}
                            error={errors.supplier}
                            isNew={isNew}/>
                        : <RenderFormSelect
                            label="Customer"
                            name="customer"
                            entities={customers}
                            value={address?.customer?.name}
                            error={errors.customer}
                            isNew={isNew}/>) : null}
                    <Button className="d-block mx-auto" type="submit"  variant="primary" >
                        Save
                    </Button>
                </Form>
            </EntityModal>
        </div>
    );
}
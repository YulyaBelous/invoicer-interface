import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {PencilFill} from "react-bootstrap-icons";

import useEntitiesService from "../../../services/entities-service";
import EntityModal from "../../../shared/components/entity-modal";

const UpdateAvailableCustomer = (props) => {

    const [supplier, setSupplier] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [isChecked, setIsChecked] = useState([]);

    const {getEntities} = useEntitiesService();

    useEffect(() => {
        getEntities('customers', setCustomers);
    }, [])

    const handleClickOpen = () => {
        const checked = new Array(customers.length).fill(false);
        if (props.supplier.availableCustomers) {
            props.supplier.availableCustomers.forEach((customer) => {
                const index = customers.findIndex((c) => c.fullName === customer);
                if (index !== -1) {
                    checked[index] = true;
                }
            });
        }
        setIsChecked(checked);
        setShow(true);
        setSupplier({...props.supplier});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event, i) => {

        const checked = [...isChecked];
        checked[i] = !isChecked[i];
        setIsChecked(checked);

        const availableCustomers = customers
            .filter((customer, index) => checked[index])
            .map((customer) => customer.fullName);

        setSupplier({...supplier, availableCustomers});
    }
    const handleSave = (e) => {
        e.preventDefault();
        props.updateAvailableCustomer(supplier, supplier.id);
        handleClose();
    }

    return (
        <div>
            <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>
            <EntityModal show={show} handleClose={handleClose} title={`Edit Supplier ${props.supplier?.id}`}>
                <Form onSubmit={e => handleSave(e)}> {customers?.map((customer, i) => (
                    <div key={`customer-${customer.id || i}`}>
                        <input
                            type="checkbox"
                            name="availableCustomers"
                            key={`customer-${i}`}
                            value={customer.fullName}
                            checked={isChecked[i]}
                            onChange={e => handleChange(e, i)}
                        />
                        {customer.fullName}
                    </div>))}
                    <Button className="d-block mx-auto"  type="submit" variant="primary" >
                        Save
                    </Button>
                </Form>
            </EntityModal>
        </div>
    );
}

export default UpdateAvailableCustomer;
import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill} from "react-bootstrap-icons";
import useEntitiesService from "../../../services/entities-service";
import AuthContext from "../../../utils/auth-context";

const UpdateAvailableCustomer = (props) => {

    const [supplier, setSupplier] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [isChecked, setIsChecked] = useState([]);

    const {getEntities} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('customers', setCustomers, 0, user.username);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        setSupplier({...props.supplier});
        setIsChecked(new Array(customers.length).fill(false))
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

        console.log(checked)
        console.log(availableCustomers)
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Edit Supplier ${props.supplier?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => handleSave(e)}> {customers?.map((customer, i) => (
                        <div>
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
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UpdateAvailableCustomer;
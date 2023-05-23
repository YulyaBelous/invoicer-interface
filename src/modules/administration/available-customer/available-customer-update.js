import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import useEntitiesService from "../../../services/entities-service";
import Validation from "../../../entities/validation";
import AuthContext from "../../../context/auth-context";

const UpdateAvailableCustomer = (props) => {

    const [supplier, setSupplier] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});

    const {validation} = Validation();

    const {getEntities} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('customers', setCustomers, 0, user.username);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        setSupplier({...props.supplier});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        console.log(event.target.name)
        console.log(event.target.value)
        if(supplier?.availableCustomers) {
            setSupplier({...supplier, availableCustomers: [...supplier.availableCustomers, event.target.value]})
        } else {
            setSupplier({...supplier, availableCustomers: [event.target.value]})
        }
        if ( !!errors[event.target.name] ) setErrors({...errors, [event.target.name]: null})
    }
    const handleSave = (e) => {
        e.preventDefault();
        const supplierEntity = {...supplier, availableCustomers: supplier.availableCustomers}
        console.log(supplierEntity)
        const newErrors = validation(supplierEntity);
        if ( Object.keys(newErrors).length > 0 ) {
            console.log(newErrors)
            setErrors(newErrors)
        } else {
            props.updateAvailableCustomer(supplierEntity, supplier.id);
            handleClose();
        }
    }

    return (
        <div>
            <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Edit Supplier ${props.supplier?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>

                        <Form.Group>
                            <Form.Label >Customers</Form.Label>
                            <Form.Select isInvalid={!!errors.availableCustomers} name="availableCustomers" multiple>
                                {customers?.map(customer => (
                                    <option value={customer.fullName} key={customer.id}>
                                        {customer.fullName}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                { errors.availableCustomers }
                            </Form.Control.Feedback>
                        </Form.Group>
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
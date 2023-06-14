import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import useEntitiesService from "../../../services/entities-service";
import Validation from "../../../utils/validation";
import renderFormGroup from "../../../shared/components/render-form-group";
import RenderFormSelect from "../../../shared/components/render-form-select";

const CreateOrUpdateUsers = (props) => {

    const [user, setUser] = useState([]);
    const [authorities, setAuthorities] = useState([]);

    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {validation} = Validation();

    const {getEntities} = useEntitiesService();

    useEffect(() => {
        setIsNew(props.isNew);
        getEntities('admin/authorities', setAuthorities);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        setUser({...props.user});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        let { name, value, selectedOptions } = event.target;
        if(name === "authorities") {
            value = Array.from(selectedOptions, (option) => option.value);
        }
        setUser(prevUser => ({...prevUser, [name]: value}));
        if (errors[name]) {
            setErrors(prevErrors => ({...prevErrors, [name]: null}));
        }
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length === 0) {
            isNew ? props.createUser(user) : props.updateUser(user, user.id);
            handleClose();
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New user</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew? 'Create a new User' : `Edit User ${props.user?.id}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                        {renderFormGroup("First name", "firstName", props.user?.firstName, errors.firstName)}
                        {renderFormGroup("Last name", "lastName", props.user?.lastName, errors.lastName)}
                        {renderFormGroup("Username", "username", props.user?.username, errors.username)}
                        {renderFormGroup("Email", "email", props.user?.email, errors.email)}
                        {isNew && renderFormGroup("Password", "password", props.user?.password, errors.password)}
                        <RenderFormSelect
                            label="Authorities"
                            name="authorities"
                            error={errors.authorities}
                            entities={authorities}
                            isMultiple={true}
                        />
                        <Button className="d-block mx-auto"  type="submit" variant="primary" > Save </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CreateOrUpdateUsers;
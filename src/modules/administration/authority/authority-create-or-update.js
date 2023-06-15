import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import Validation from "../../../utils/validation";
import renderFormGroup from "../../../shared/components/render-form-group";
import EntityModal from "../../../shared/components/entity-modal";

export const CreateOrUpdateAuthority = (props) => {

    const [authority, setAuthority] = useState([]);
    const [show, setShow] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [errors, setErrors] = useState({});

    const {validation} = Validation();

    useEffect(() => {
        setIsNew(props.isNew);
    }, [])

    const handleClickOpen = () => {
        setShow(true);
        setAuthority({...props.authority});
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setAuthority({...authority, [event.target.name]: event.target.value});
        if (!!errors[event.target.name]) {
            setErrors({...errors, [event.target.name]: null})
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            const authorityEntity = {...authority, ...values}
            isNew ? props.createAuthority(authorityEntity) : props.updateAuthority(authorityEntity, authorityEntity.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary"> <Plus size={29}/> New authority</Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <EntityModal
                show={show}
                handleClose={handleClose}
                title={isNew? 'Create a new Authority' : `Edit Authority ${props.authority?.id}`}
            >
                <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Name", "name", props.authority?.name, errors.name)}
                    <Button className="d-block mx-auto" type="submit" variant="primary" > Save </Button>
                </Form>
            </EntityModal>
        </div>
    );
}

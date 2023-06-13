import React, {useContext, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {PencilFill, Plus} from "react-bootstrap-icons";
import AuthContext from "../../context/auth-context";
import Validation from "../validation";
import renderFormGroup from "../../shared/components/render-form-group";
import EntityModal from "../../shared/components/entity-modal";

const CreateOrUpdateSupplier = (props) => {

    const [newSupplier, setNewSupplier] = useState([]);

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});

    const {user, isAdmin} = useContext(AuthContext);
    const {isNew, supplier, createSupplier, updateSupplier} = props;

    const {validation} = Validation();

    const handleClickOpen = () => {
        setShow(true);
        if(isAdmin) {
            setNewSupplier({...supplier});
        } else {
            setNewSupplier({...supplier, username : user.username});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        setNewSupplier({...newSupplier, [event.target.name]: event.target.value});
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
            const supplierEntity = {...newSupplier, ...values}
            isNew?  createSupplier(supplierEntity) : updateSupplier(supplierEntity, supplierEntity.id);
            handleClose();
        }
    }

    return (
        <div>
            {isNew? <Button onClick={handleClickOpen} className="mb-3 float-sm-end" variant="primary">
                    <Plus size={29}/> New supplier </Button>
                : <Button onClick={ handleClickOpen} variant="primary"><PencilFill/></Button>}
            <EntityModal show={show} handleClose={handleClose} title={isNew? 'Create a new Supplier' : `Edit Supplier ${supplier?.id}`}>
                <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Name", "name", supplier?.name, errors.name)}
                    {renderFormGroup("Short name", "shortName", supplier?.shortName, errors.shortName)}
                    {renderFormGroup("Full name", "fullName", supplier?.fullName, errors.fullName)}
                    {renderFormGroup("Tax code", "taxCode", supplier?.taxCode, errors.taxCode)}
                    <Button className="d-block mx-auto" type="submit" variant="primary" > Save </Button>
                </Form>
            </EntityModal>
        </div>
    );
}

export default CreateOrUpdateSupplier;

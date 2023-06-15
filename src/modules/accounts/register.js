import {Alert, Button, Form, NavDropdown} from "react-bootstrap";
import React, {useState} from "react";
import {CaretRightFill} from "react-bootstrap-icons";
import useUserService from "../../services/user-service";
import Validation from "../../utils/validation";
import renderFormGroup from "../../shared/components/render-form-group";
import EntityModal from "../../shared/components/entity-modal";

const RegisterForm = () => {

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState();

    const {register, error, clearError, loading} = useUserService();
    const {validation} = Validation();

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleChange = (event) => {
        if (!!errors[event.target.name]) {
            setErrors({...errors, [event.target.name]: null})
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const newErrors = validation(values);
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors)
        } else {
            clearError();
            const res = await register(values);
            setMessage(res.message);
        }
    }

    const viewMessage = (message, variant) => {
        return (<> <Alert key={variant} variant={variant}> {message} </Alert> </>)
    }

    return(
        <>
            <NavDropdown.Item onClick={handleClickOpen} > <CaretRightFill color="royalblue"/> Registration</NavDropdown.Item>
            <EntityModal show={show} handleClose={handleClose} title="Registration">
                <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Username", "username", '', errors.username)}
                    {renderFormGroup("First name", "firstName", '', errors.firstName)}
                    {renderFormGroup("Last name", "lastName", '', errors.lastName)}
                    {renderFormGroup("Email", "email", '', errors.email)}
                    {renderFormGroup("Password", "password", '', errors.password)}
                    {message? (error? viewMessage(message, "danger") : viewMessage(message, "success")) : null}
                    <div className="d-grid gap-2">
                        <Button type="submit" disabled={loading} variant="primary" >
                            {loading? "Loading..." : "Save"}
                        </Button>
                    </div>
                </Form>
            </EntityModal>
        </>
    )
}

export default RegisterForm;
import React, {useContext, useState} from "react";
import {Alert, Button, Form, NavDropdown} from "react-bootstrap";
import {CaretRightFill, PersonCircle} from "react-bootstrap-icons";

import useUserService from "../../services/user-service";
import AuthContext from "../../utils/auth-context";
import Validation from "../../utils/validation";
import renderFormGroup from "../../shared/components/render-form-group";
import EntityModal from "../../shared/components/entity-modal";

const LoginForm = () => {

    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const {login, error, clearError, loading} = useUserService();
    const {validation} = Validation();

    const {logIn, isActivated} = useContext(AuthContext);

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
            setMessage(null);
            const res = await login(values);
            if(typeof(res) !== "string") {
                logIn();
                if(!isActivated) {
                    setMessage("Account not activated");
                } else {
                    handleClose();
                }
            }
            if(!isActivated) {
                setMessage("Account not activated");
            }
        }
    }

    const viewMessage = (message, variant) => {
        return (<> <Alert key={variant} variant={variant}> {message} </Alert> </>)
    }

    return(
        <>
            <NavDropdown.Item onClick={handleClickOpen} > <CaretRightFill color="royalblue"/> Log in</NavDropdown.Item>
            <EntityModal show={show} handleClose={handleClose} title="Log in">
                <div ><PersonCircle className="d-block mx-auto" size={100} style={{color: "gray"}}/></div>
                <Form onChange={handleChange} onSubmit={e => handleSave(e)}>
                    {renderFormGroup("Username", "username", '', errors.username)}
                    {renderFormGroup("Password", "password", '', errors.password)}
                    {error? (viewMessage(error, "danger")) : (message !== null? viewMessage(message, "danger") : null)}
                    <div className="d-grid gap-2">
                        <Button type="submit"  disabled={loading}  variant="primary" >
                            {loading? "Loading..." : "Log in"}
                        </Button>
                    </div>
                </Form>
            </EntityModal>
        </>
    )
}

export default LoginForm;
import React from "react";
import {Form} from "react-bootstrap";

const renderFormGroup = (label, name, defaultValue, error) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control isInvalid={!!error} defaultValue={defaultValue} name={name} />
        <Form.Control.Feedback type="invalid">
            {error}
        </Form.Control.Feedback>
    </Form.Group>
);

export default renderFormGroup;
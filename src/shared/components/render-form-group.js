import React from "react";
import {Form} from "react-bootstrap";

const renderFormGroup = (label, name, defaultValue, error, type = "text", step) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
            isInvalid={!!error}
            defaultValue={defaultValue}
            name={name}
            placeholder={label}
            type={type}
            step={step}
        />
        <Form.Control.Feedback type="invalid">
            {error}
        </Form.Control.Feedback>
    </Form.Group>
);

export default renderFormGroup;
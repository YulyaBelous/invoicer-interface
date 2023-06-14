import React from "react";
import {Form} from "react-bootstrap";

const RenderFormSelect = ({label, name, error, entities, isMultiple, isNew, value}) => {

        return (
            <Form.Group className="mb-3">
                    <Form.Label>{label}</Form.Label>
                    <Form.Select isInvalid={!!error} name={name} multiple={isMultiple}>
                            {!isMultiple && <option> {isNew ? `Select ${label}` : value} </option>}
                            {entities?.map(entity => (
                                <option value={isMultiple? entity.name : entity.id} key={entity.id}>
                                        {entity.name? entity.name: `${entity.country}, ${entity.city}, ${entity.postCode}, ${entity.streetLine1}`}
                                </option>
                            ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                            {error}
                    </Form.Control.Feedback>
            </Form.Group>
        )
};

export default RenderFormSelect;

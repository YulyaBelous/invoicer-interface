import React from "react";
import {Form} from "react-bootstrap";

const ViewSupplierOrCustomer = (props) => {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="mt-3" >{props.title}</Form.Label>
                <Form.Select className="mb-3" isInvalid={!!props.valid} name={props.title.toLowerCase()}>
                    <option>{props.isNew? (`Select ${props.title}`)
                        : (props.title === "Supplier"? props.entity.supplier?.name: props.entity.customer?.name)}</option>
                    {
                        props.entities ? props.entities.map(entity =>
                            <option value={entity.id} key={entity.id}>{entity.name}</option>
                        ) : null
                    }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {props.valid}
                </Form.Control.Feedback>
            </Form.Group>
        );
}

export default ViewSupplierOrCustomer;
import {Form} from "react-bootstrap";
import React from "react";

const ViewSelectForm = (props) => {
    return (

        <Form.Group className="mb-3">
            <Form.Label className="mt-3" >{props.title}</Form.Label>
            <Form.Select className="mb-3" name={props.name}>

                <option>{props.selectEntity}</option>
                {
                    props.entity ? props.entity.map(entity =>
                        <option value={entity.id} key={entity.id}>{entity.name}</option>
                    ) : null
                }
            </Form.Select>
        </Form.Group>
    );
}

export default ViewSelectForm;
import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const RadioButtons = ({ radioValue, setRadioValue }) => {

    const radios = [
        { name: 'Supplier', value: '1' },
        { name: 'Customer', value: '2' },
    ];

    return (
        <ButtonGroup>
            {radios.map((radio, i) => (
                <ToggleButton
                    key={i}
                    id={`radio-${i}`}
                    type="radio"
                    variant={i % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    {radio.name}
                </ToggleButton>
            ))}
        </ButtonGroup>
    );
};

export default RadioButtons;
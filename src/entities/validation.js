
const Validation = () => {

    const validation = (form) => {
        let errors = {};
        for(const [key, value] of Object.entries(form)) {
            if(!value || value === '') {
                errors = {...errors, [key] : 'This field cannot be empty'};
            } else if(key === 'unitPrice' || key === 'quantity' || key === 'amount') {
                if(key === 'quantity' && value%1 !== 0) {
                    errors = {...errors, [key] : 'This field cannot have a fractional value'};
                }
                if(value < 0) {
                    errors = {...errors, [key] : 'This field cannot be negative'};
                }
            } else if(typeof(value) === "string" && value.includes("Select")) {
                errors = {...errors, [key] : `Need to choose ${value.slice(7, value.length)}`};
            }
        }
        return errors;
    }

    return {validation};
}

export default Validation;
const { body, validationResult } = require('express-validator');

const checkRelatedExists = (fieldName) => {
        return body(fieldName).custom(
            (field, { req, res }) => {
                const errMsg = `${fieldName} not present`;
                if(field == null) {
                    throw new Error(errMsg);
                    return false
                }
                if(field.length < 1) {
                    throw new Error(errMsg);
                    return false
                }

                return true
        });
}

module.exports = {
    checkRelatedExists,
}    
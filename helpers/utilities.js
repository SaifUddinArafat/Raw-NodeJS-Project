/*
# Title:Utilities
# Description:Important Utiliti Functions
# Author: Saif Uddin
# Date:06-22-2022
*/

// dependencies
const crypto = require('crypto');
const environment = require('./environment');

// module scaffolding
const utilities = {};

// parse JSON strig to Object
utilities.parseJSON = (jsonString) => {
    let output;

    // try catch block for error handling
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// export module
module.exports = utilities;

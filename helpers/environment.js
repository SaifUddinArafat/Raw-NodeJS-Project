/*
# Title:Environments
# Description:Handle all Environment related things
# Author: Saif Uddin
# Date:06-18-22
*/
// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'alkdjflaaaldkjf',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'LaJhggHEdq5yKkPJdBXLMoAubyHwAB4ttD',
        authToken: '7d6e068e84bebed232a0a220ac02aea7',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ldkjflakdfjals',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'LaJhggHEdq5yKkPJdBXLMoAubyHwAB4ttD',
        authToken: '7d6e068e84bebed232a0a220ac02aea7',
    },
};
// determine which environment was passed
// eslint-disable-next-line prettier/prettier
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
// export corresponding environment object
// eslint-disable-next-line prettier/prettier
const environmentToExport = typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;

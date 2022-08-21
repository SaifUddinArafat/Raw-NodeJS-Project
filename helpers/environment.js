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
        fromPhone: '+14792399029',
        accountSid: 'AYajjmpDLunawN9mRtBUbWAMSNG9on1NRL',
        authToken: '429e52e7982d5001ef8d6af79a9bc85d',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ldkjflakdfjals',
    maxChecks: 5,
    twilio: {
        fromPhone: '+14792399029',
        accountSid: 'AYajjmpDLunawN9mRtBUbWAMSNG9on1NRL',
        authToken: '429e52e7982d5001ef8d6af79a9bc85d',
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

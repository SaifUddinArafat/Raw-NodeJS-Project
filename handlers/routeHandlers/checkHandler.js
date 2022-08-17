/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
/*
# Title:Check Handler
# Description:Handler to handle user defined Checks
# Author: Saif Uddin
# Date:7-22-2022
*/

// dependencies
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environment');

// moudule scaffolding
const handler = {};
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._checks[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._checks = {};

handler._checks.post = (requestProperties, callback) => {
    // validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        [('http', 'https')].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;
    // typeof(array) = object
    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSec =
        typeof requestProperties.body.timeoutSec === 'number' &&
        requestProperties.body.timeoutSec % 1 === 0 &&
        requestProperties.body.timeoutSec >= 1 &&
        requestProperties.body.timeoutSec <= 5
            ? requestProperties.body.timeoutSec
            : false;
    if (protocol && url && method && successCodes && timeoutSec) {
        const token =
            typeof requestProperties.reqHeaders.token === 'string'
                ? requestProperties.reqHeaders.token
                : false;
        // find user phone using token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // find user data
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        // verify token
                        tokenHandler._token.verify(token, userPhone, (tokenValid) => {
                            if (tokenValid) {
                                const userObject = parseJSON(userData);
                                const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObjet = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSec,
                                    };

                                    // save checkObject to the Database
                                    data.create('checks', checkId, checkObjet, (err3) => {
                                        if (!err3) {
                                            // add check id to the users object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // update the user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    delete userObject.password;
                                                    callback(200, userObject);
                                                } else {
                                                    callback(500, {
                                                        error: 'Server Side Problem',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Server Side Error',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'Already Reached maxChecks limit',
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication Error',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'user not found',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Error',
                });
            }
        });
    } else {
        callback(400, {
            error: 'WRONG Request',
        });
    }
};
handler._checks.get = (requestProperties, callback) => {
    // get checkId
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // look up the Checks from the DB
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token =
                    typeof requestProperties.reqHeaders.token === 'string' &&
                    requestProperties.reqHeaders.token.trim().length === 20
                        ? requestProperties.reqHeaders.token
                        : false;
                const phone = parseJSON(checkData).userPhone;
                tokenHandler._token.verify(token, phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            error: 'Authentication Error',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Server Side Error',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is a problem in your request',
        });
    }
};
handler._checks.put = (requestProperties, callback) => {
    // validate checkid
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    // validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;
    // typeof(array) = object
    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSec =
        typeof requestProperties.body.timeoutSec === 'number' &&
        requestProperties.body.timeoutSec % 1 === 0 &&
        requestProperties.body.timeoutSec >= 1 &&
        requestProperties.body.timeoutSec <= 5
            ? requestProperties.body.timeoutSec
            : false;
    if (id) {
        if (protocol || url || method || successCodes || timeoutSec) {
            // lookup for user data
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const token =
                        typeof requestProperties.reqHeaders.token === 'string' &&
                        requestProperties.reqHeaders.token.trim().length === 20
                            ? requestProperties.reqHeaders.token
                            : false;
                    const checkObject = parseJSON(checkData);
                    const phone = checkObject.userPhone;
                    tokenHandler._token.verify(token, phone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeoutSec) {
                                checkObject.timeoutSec = timeoutSec;
                            }

                            // store updated data in db
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'Checks are Updated',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Server Side error',
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: 'Authentication Error',
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: 'Server Side Error!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have to update atleast one field',
            });
        }
    } else {
        callback(400, {
            error: 'Wrong Request',
        });
    }
};
handler._checks.delete = (requestProperties, callback) => {
    // validate Check Id
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err) {
                const token =
                    typeof requestProperties.reqHeaders.token === 'string' &&
                    requestProperties.reqHeaders.token.trim().length === 20
                        ? requestProperties.reqHeaders.token
                        : false;

                const checkObject = parseJSON(checkData);
                const phone = checkObject.userPhone;
                tokenHandler._token.verify(token, phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'Checks Successfully Deleted',
                                });
                            } else {
                                callback(500, {
                                    error: 'Server Error',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication Error',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Server Error',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Invalid Check Id',
        });
    }
};
// export
module.exports = handler;

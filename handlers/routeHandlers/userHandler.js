/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
/*
# Title:User Handler
# Description:Handler to handle user related routes
# Author: Saif Uddin
# Date:6-15-22
*/
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 4
            ? requestProperties.body.password
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(500, {
                    error: 'User may aleardy exist',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handler._users.get = (requestProperties, callback) => {
    // Check the phone number is valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        // verify token (Token Based Authentication)
        const token =
            typeof requestProperties.reqHeaders.token === 'string'
                ? requestProperties.reqHeaders.token
                : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup for user
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) };
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user is not in the DataBase',
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
        callback(404, {
            error: 'Requested user no found',
        });
    }
};
handler._users.put = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 4
            ? requestProperties.body.password
            : false;
    if (phone) {
        if (firstName || lastName || password) {
            // verify token (Token Based Authentication)
            const token =
                typeof requestProperties.reqHeaders.token === 'string'
                    ? requestProperties.reqHeaders.token
                    : false;
            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    // lookup for the user
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) };
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            // update the database
                            data.update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'User was updated successfully',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in the server side',
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                error: 'You have a problem in your request',
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
            callback(404, {
                error: 'You have a problem in your request',
            });
        }
    } else {
        callback(404, {
            error: 'Invalid phone number. Please try again',
        });
    }
};
handler._users.delete = (requestProperties, callback) => {
    // validate phone number
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length >= 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        // verify token (Token Based Authentication)
        const token =
            typeof requestProperties.reqHeaders.token === 'string'
                ? requestProperties.reqHeaders.token
                : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup for user
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User Deleted Successfully',
                                });
                            } else {
                                callback(500, {
                                    error: 'There is a problem in server Side!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
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
        callback(404, {
            error: 'User not Found',
        });
    }
};

module.exports = handler;

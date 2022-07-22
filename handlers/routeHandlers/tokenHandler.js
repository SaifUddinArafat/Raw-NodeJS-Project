/* eslint-disable operator-linebreak */
/*
# Title:Token Handler
# Description:Handler for token related route & authentication
# Author: Saif Uddin
# Date:07-4-2022
*/
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
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
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            const hashedPassword = hash(password);
            if (!err && hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                /* const expiresAfter = `${(expires - Date.now()) / (60 * 60 * 1000)}hr`; */
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                    // expiresAfter,
                };

                // store the token in Db
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a probolem in the server side',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Wrong Password',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request',
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    // check token id
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback('404', {
                    error: 'Token Not Found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested User Not Found',
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    // validation
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (!err && tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                /* tokenObject.expiresAfter = `${
                    (tokenObject.expires - Date.now()) / (60 * 60 * 1000)
                }hr`; */
                // store updated Data
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token time extended',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in Server Side !',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'token already Expired',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    // check token validity
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token was Successfully Deleted',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in server side',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'user not Found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Invalid token Id',
        });
    }
};

// general purpose function not handler function
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            const verify =
                parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now();

            if (verify) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// export handler
module.exports = handler;

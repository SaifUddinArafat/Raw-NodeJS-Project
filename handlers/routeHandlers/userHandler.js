/*
# Title:User Handler
# Description:Handler to handle user related routes
# Author: Saif Uddin
# Date:6-15-22
*/
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
// module scaffolding
const handler = {};
handler.sampleHandler = (requestProperties, callback) => {
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
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line operator-linebreak
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line operator-linebreak
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line operator-linebreak
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line operator-linebreak
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    const tosAgreement =
        // eslint-disable-next-line prettier/prettier
        // eslint-disable-next-line operator-linebreak
        typeof requestProperties.body.tosAgreement === 'string' &&
        requestProperties.body.tosAgreement.trim().length > 0
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err) => {
            if (err) {
                const userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObj, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'user Created Successfully',
                        });
                    } else {
                        callback(500, { error: 'Could not create users' });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your Request',
        });
    }
};
handler._users.get = (requestProperties, callback) => {};
handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;

/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
/*
# Title:Notification Library
# Description:Important functioins to notify users
# Author: Saif Uddin
# Date:7-30-2022
*/

// dependencies
const https = require('https');
const { twilio } = require('./environment');
// module scaffolding
const notifications = {};

// send sms to user using twilio Api
notifications.sendTwilioSms = (phone, msg, callback) => {
    // validate input
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;

    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;
    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `'+88'${userPhone}`,
            Body: userMsg,
        };

        // stringify the payload
        const stringifyPayload = JSON.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        // Instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;

            // call back successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given Parameters were mising or invalid');
    }
};

// export the module
module.exports = notifications;

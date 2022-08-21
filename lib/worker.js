/* eslint-disable operator-linebreak */
/*
# Title: worker library
# Description: worker related files
# Author: Saif Uddin
# Date:06-15-2022
*/

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');

// app object - Module Scaffolding
const worker = {};
// perform check
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutcome = {
        error: false,
        responseCode: false,
    };

    // mark the outcome has not been sent yet
    let outcomeSent = false;

    // parse the URL from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const { hostname } = parsedUrl;
    const { path } = parsedUrl;
    // create the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSec * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;
    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the status code
        const status = res.statusCode;

        // update the check outcome and pass to next step
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutcome);
            outcomeSent = true;
        } else {
            console.log('error: outcome already sent');
        }
    });

    req.on('error', (e) => {
        checkOutcome = {
            error: true,
            value: e,
        };
        // update the check outcome and pass to next step
        if (!outcomeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutcome);
            outcomeSent = true;
        } else {
            console.log('error: outcome already sent');
        }
    });
    req.on('timeout', () => {
        checkOutcome = {
            error: true,
            value: 'timeout',
        };
        // update the check outcome and pass to next step
        if (!outcomeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutcome);
            outcomeSent = true;
        } else {
            console.log('error: outcome already sent');
        }
    });

    // send request
    req.end();
};

// Update and save the check outcome
worker.processCheckOutCome = (originalCheckData, checkOutcome) => {
    // check if check outcome is up or down
    const state =
        !checkOutcome.error &&
        checkOutcome.responseCode ===
            originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
            ? 'up'
            : 'down';
    // Decide weather Notify the user or not
    const alertWanted = !!(originalCheckData.lastChecked && originalCheckData.state !== state);

    // update the check data
    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to DB
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                // send the data to next process
                worker.alertUser(newCheckData);
            } else {
                console.log('Stage not changed, No alert neqired');
            }
        } else {
            console.log('Error trying to save check data of one of the checks');
        }
    });
};

// notify the user while required
worker.alertUser = (newCheckData) => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was notified via SMS: ${msg}`);
        } else {
            console.log(`There was a problem sending sms ${err}`);
        }
    });
};

// Individual check data Validator
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    if (originalData && originalData.id) {
        originalData.state =
            typeof originalData.state === 'string' &&
            ['up', 'down'].indexOf(originalData.state) > -1
                ? originalData.state
                : 'down';
        originalData.lastChecked =
            typeof originalData.lastChecked === 'number' && originalData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;
        // perform the checks
        worker.performCheck(originalData);
    } else {
        console.log('Error: Check was invalid or not properly formated');
    }
};
// lookup all the checks from Db
worker.gatherAllChecks = () => {
    // get all checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        // pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: Reading one of the chekcs data');
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to process');
        }
    });
};
// timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 6);
};
// start the worker
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // loop the checks to cotinue the loop
    worker.loop();
};

module.exports = worker;

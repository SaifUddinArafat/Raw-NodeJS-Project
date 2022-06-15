/*
# Title:Sample Handler
# Description:Sample Handler
# Author: Saif Uddin
# Date:6-15-22
*/

// module scaffolding
const handler = {};
handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample Url',
    });
};

module.exports = handler;

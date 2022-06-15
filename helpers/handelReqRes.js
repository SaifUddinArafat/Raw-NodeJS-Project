/*
# Title:Handle Request Response
# Description:Handle Request and Response
# Author: Saif Uddin
# Date:6-15-22
*/
// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notfoundHandler');

// handler Object - Module Scaffolding
const handler = {};

// handle Request Response
handler.handleReqRes = (req, res) => {
    // request handling
    // get url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // (/^\/+|\/+$/g) its an Regular Expression To remove unwanted Slash
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const reqHeaders = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        reqHeaders,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        // return the response
        res.writeHead(statusCode);
        res.end(payloadString);
    });

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        // response handle
        res.end('hello programmer');
    });
    /*     console.log(method);
    console.log(trimmedPath);
    console.log(quaryStringObject);
    console.log(reqHeaders); */
};

module.exports = handler;

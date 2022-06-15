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
    const parsedUrl = url.parse(req.url, true); // geting parsed url
    // check it using console.log(parsedurl);
    const path = parsedUrl.pathname; // getting path name of the url
    // check it using console.log(parsedurl);
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // (/^\/+|\/+$/g) its an Regular Expression To remove unwanted Slash
    // check it using console.log(trimmedPath);
    const method = req.method.toLowerCase(); // getting request method name
    // check it using console.log(method);
    const queryStringObject = parsedUrl.query; // getting query object from the url
    // check it using console.log(queryStringObject);
    const reqHeaders = req.headers; // getting request headers
    // check it using console.log(reqHeader);

    // collecting all the request propertis into an single variable
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        reqHeaders,
    };

    // decoder for reding the buffer data from response
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    // created a chosenHandler variable to check the requested routes
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    // every routes has a hadler which contin a function
    // so choosenHandler variable works as a function
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

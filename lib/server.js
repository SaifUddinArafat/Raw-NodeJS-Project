/*
# Title: Server library
# Description: server related files
# Author: Saif Uddin
# Date:06-15-2022
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handelReqRes');
const environment = require('../helpers/environment');

// app object - Module Scaffolding
const server = {};

// create server
server.createServer = () => {
    const serverInit = http.createServer(server.reqResHandler);
    serverInit.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
server.reqResHandler = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
};

module.exports = server;

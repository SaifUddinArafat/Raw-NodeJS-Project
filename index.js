/*
# Title:Raw NodeJs Project
# Description: Uptime Monitoring App Using Raw Node Js
# Author: Saif Uddin
# Date:06-15-2022
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handelReqRes');
const environment = require('./helpers/environment');

// app object - Module Scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.reqResHandler);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.reqResHandler = handleReqRes;

// start the server
app.createServer();

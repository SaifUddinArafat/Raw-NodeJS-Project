/*
# Title:Raw NodeJs Project
# Description: Uptime Monitoring App Using Raw Node Js
# Author: Saif Uddin
# Date:06-15-2022
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handelReqRes');
// app object - Module Scaffolding
const app = {};

// config
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.reqResHandler);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};

// handle Request Response
app.reqResHandler = handleReqRes;

// start the server
app.createServer();

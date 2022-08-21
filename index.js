/*
# Title: Project Initailization file
# Description: Initail file to start server and worker
# Author: Saif Uddin
# Date:06-15-2022
*/

// Dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// app object - Module Scaffolding
const app = {};

// create server
app.init = () => {
    // start the server
    server.init();
    // start the worker
    worker.init();
};

// initialize the init function
app.init();

module.exports = app;

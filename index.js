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
const data = require('./lib/data');

// app object - Module Scaffolding
const app = {};

// testing file system
/* data.update('test', 'newFile', { name: 'England', lang: 'English' }, (err) => {
    console.log('Error was:', err);
});
data.read('test', 'newFile', (err, result) => {
    console.log(err, result);
}); */
data.delete('test', 'newFile', (err) => {
    console.log(err);
});
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

/*
# Title:Routes
# Description:Routes Application
# Author: Saif Uddin
# Date:06-15-22
*/
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;

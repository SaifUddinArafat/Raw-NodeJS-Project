/*
# Title:Routes
# Description:Routes Application
# Author: Saif Uddin
# Date:06-15-22
*/
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
};

module.exports = routes;

/*
# Title:Not Found Handler
# Description:Not Found Handler
# Author: Saif Uddin
# Date:6-15-22
*/

// module scaffolding
const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: "Your Url isn't found",
    });
};

module.exports = handler;

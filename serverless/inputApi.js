"use strict";


const getResponse = () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!'
        })
    };
};


module.exports.createAlert = (event, context, callback) => {
    callback(null, getResponse());
};

module.exports.linkImage = (event, context, callback) => {
    callback(null, getResponse());
};

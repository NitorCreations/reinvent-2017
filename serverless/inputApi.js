"use strict";


const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

module.exports.createAlert = (event, context, callback) => {
    console.log(event);

    const requestBody = event.body;
    const alertId = uuidv1();
    const db = new AWS.DynamoDB();

    let alert = JSON.parse(requestBody);

    let item = {
        id: {S: alertId},
        type: {S: alert.type},
        description: {S: alert.description},
        time: {S: alert.time},
        lon: {S: alert.lon},
        lat: {S: alert.lat}
    };
    console.log(item);

    db.putItem({
        TableName: process.env.NOT_APPROVED_ALERTS_TABLE,
        Item: item
    }, (err, data) => {
        if(err) {
            console.log(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({status: "ERROR", err: err})
            });
        } else {
            callback(null, {
                statusCode: 201,
                body: JSON.stringify({status: "OK", alertId: alertId})
            });
        }
    });
};


module.exports.linkImage = (event, context, callback) => {
    callback(null, getResponse(event));
};

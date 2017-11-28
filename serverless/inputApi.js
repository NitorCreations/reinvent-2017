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
        lat: {S: alert.lat},
        status: {S: "pending"}
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
    const bucketName = process.env.IMAGES_BUCKET;
    const alertId = event.queryStringParameters.alertId;
    const data = event.body;
    const s3 = new AWS.S3();
    const rekognition = new AWS.Rekognition();

    const params = {
        Bucket: bucketName,
        Key: alertId,
        Body: data,
        ContentType: "image/jpg"
    };

    s3.upload(params, (err, data) => {
        if(err) {
            console.log(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({status: "ERROR", err: err})
            });
        } else {
            const params = {
                Image: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: alertId
                    }
                },
                MaxLabels: 100,
                MinConfidence: 80
            };

            rekognition.detectLabels(params, (err, data) => {
                if(err) {
                    console.log(err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({status: "ERROR", err: err})
                    });
                } else {
                    callback(null, {
                        statusCode: 201,
                        body: JSON.stringify({status: "OK", data: data})
                    });
                }
            });
        }
    });
};

'use strict';

const Https = require('https');

/**
 * wrapper class for Alexa Address API
 */
class AlexaDeviceAddressClient {
    /**
     * @param apiEndpoint   Alexa API endpoint
     * @param deviceId      device ID of your alexa
     * @param consentToken  valid address consent token
     */
    constructor(apiEndpoint, deviceId, consentToken) {
        this.deviceId = deviceId;
        this.consentToken = consentToken;
        this.endpoint = apiEndpoint.replace(/^https?:\/\//i, "");
    }

    /**
     * Get full address of the device from Address API
     *
     * @return {Promise}
     */
    getFullAddress() {
        return this.handleDeviceAddressApiRequest(`/v1/devices/${this.deviceId}/settings/address`);
    }

    /**
     * Get country and postal code of the device from Address API
     *
     * @return {Promise}
     */
    getCountryAndPostalCode() {
        return this.handleDeviceAddressApiRequest(`/v1/devices/${this.deviceId}/settings/address/countryAndPostalCode`);
    }

    /**
     * API request helper
     *
     * @param path
     */
    handleDeviceAddressApiRequest(path) {
        const requestOptions = {
            hostname: this.endpoint,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.consentToken
            }
        }

        return new Promise((resolve, reject) => {
            Https.get(requestOptions, (response) => {
                console.log(`Device Address API status code: ${response.statusCode}`);

                response.on('data', (data) => {
                    let responsePayloadObject = JSON.parse(data);

                    const deviceAddressResponse = {
                        statusCode: response.statusCode,
                        address: responsePayloadObject
                    };

                    resolve(deviceAddressResponse);
                });
            }).on('error', (e) => {
                console.error(e);
                reject();
            });
        })
    }
}

module.exports = AlexaDeviceAddressClient;

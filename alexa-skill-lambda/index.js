'use strict';

const Alexa = require('alexa-sdk');
const fetch = require('node-fetch');
const _ = require('lodash');
const AlexaDeviceAddressClient = require('./AlexaDeviceAddressClient');

// TODO: make configs configurable
const APP_ID = 'amzn1.ask.skill.91d3fc21-d7de-4cf2-a46d-605eae83b3d5'; // Skill name from AWS console
const ALERT_API_BASE = 'https://i4dyasbtk9.execute-api.us-east-1.amazonaws.com'; // Base path to alert lambda's

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Emergency Notification',
            WELCOME_MESSAGE: "What is your emergency?",
            WELCOME_REPROMPT: "What is your emergency?",
            LAUNCH_QUESTION: "What's wrong?",
            GEO_SUCCESS: "Got it, sending alert."
            GEO_FAILED: "Sorry, I couldn't figure out where you are"
            HELP_MESSAGE: "Need help? To create an alert, just say there's an emergency. Otherwise you can just ask me for current status.",
            STOP_MESSAGE: 'Goodbye!'
        }
    },
};

const handlers = {
    // The trigger word is emergency
    // Alexa, there's an _emergency_
    'LaunchRequest': function () {
        this.response
            .speak(this.t('LAUNCH_QUESTION'))
            .listen('something');
        this.attributes.isStarted = true;
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response
            .speak(this.t('HELP_MESSAGE'))
            .listen(this.t('HELP_MESSAGE'));

        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
        this.response.speak(this.t('STOP_MESSAGE'))
        this.emit(':responseReady');
    },
    // Alexa, check emergency and tell me status
    'Status': function() {
        this.response.speak('everything is fine').listen(this.t('WELCOME_REPROMPT'));
        this.emit(':responseReady');
    },
    'Fire': function() {
        if (!this.attributes.isStarted) {
            this.emit(':NewSession');
            return
        }

        resolveAddressToGeo.call(this).then(geo => {
            if (!geo.lat || !geo.lon) {
                this.response
                    .speak(this.t('GEO_FAILED'))
                    .listen(this.t('WELCOME_REPROMPT'));
                this.emit(':responseReady');
                return
            }

            createAlert(geo, 'Fire').then(resp => {
                this.response
                    .speak(this.t('GEO_SUCCESS'));
                this.emit(':responseReady');
            })
        })
    },
    'Earthquake': function() {
        if (!this.attributes.isStarted) {
            this.emit(':NewSession');
            return
        }

        resolveAddressToGeo.call(this).then(geo => {
            if (!geo.lat || !geo.lon) {
                this.response
                    .speak(this.t('GEO_FAILED'))
                    .listen(this.t('WELCOME_REPROMPT'));
                this.emit(':responseReady');
                return
            }

            createAlert(geo, 'Earthquake').then(resp => {
                this.response
                    .speak(this.t('GEO_SUCCESS'));
                this.emit(':responseReady');
            })
        })
    },
    'Unhandled': function () {
        this.emit('AMAZON.HelpIntent');
    },
};

/**
 * Creates alert in stack database
 * @param  {Object} where  Geo coordinates { lat: 123, lon: -123 }
 * @param  {String} what   Alert type
 * @return {Promise}
 */
function createAlert(where, what) {
    return fetch(
        `${ALERT_API_PATH}/demo/alert/create`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "type": what,
                "lon": where.lon.toString(),
                "lat": where.lat.toString(),
                "description": "Alert from Alexa",
                "time": (new Date()).toISOString()
            })
        }
    )
    .then(resp => resp.json())
}

/**
 * Resolves address from Alexa device to geo coordinates (lat, lon)
 * @return {Promise}   promise resolved with geo coordinates
 */
function resolveAddressToGeo() {
    const alexaDeviceAddressClient = new AlexaDeviceAddressClient(
        this.event.context.System.apiEndpoint,
        this.event.context.System.device.deviceId,
        this.event.context.System.user.permissions.consentToken
    );

    return alexaDeviceAddressClient.getFullAddress()
        .then(resp => resp.address)
        .then(address => {
            // openstreetmap works fine for demo purposes. in real world this
            // would probably require some API key to avoid request throttling
            const geoApiUrl = `https://nominatim.openstreetmap.org/search/${parseAddress(address)}?format=json&limit=1`
            return fetch(geoApiUrl)
        })
        .then(resp => resp.json())
        .then(data => data && data[0])
}

function parseAddress(addr) {
    return `${addr.addressLine1}, ${addr.city}, ${addr.stateOrRegion}, ${addr.countryCode}`.replace(/\ /g, '%20')
}

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

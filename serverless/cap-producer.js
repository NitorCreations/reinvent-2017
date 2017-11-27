'use strict';

const json2xml = require('json2xml');
const _ = require('lodash');

function constructArea(payload) {
	return _.map(payload.alert.location, (location) => {
		const circleVal = location.lat+","+location.lon+" "+payload.alert.locationParams.radius;
		return {
			circle : circleVal 
		}
	})
}

//module.exports.produceCap = (event, context, callback) => {
	function produceCap () {

		const testAlertJson = {
			"alert": {
				"category": "security",
				"event": "disaster event",
				"urgency": "immediate",
				"severity": "Severe",
				"certainty": "Likely",
				"senderName": "Nitor RPTF",
				"headline" : "There's ongoing hackathon event",
				"description" : "There's ongoing hackathon. Expect really cool stuff. This is going to be huge",
				"instruction" : "Code until you drop",
				"locationType" : "circle", //TODO, only supports circle for now
				"locationParams" : {
					radius : "1"
				},
				"location": [
				{
					"lon": 25.6,
					"lat": 60.0
				}, 
				{
					"lon": 24.6,
					"lat": 61.0
				}
				],
				"description": [
				{
					language: "en-us",
					text : "this is sparta"
				}, 
				{
					language : "es-US",
					text : "this is spanish sparta"
				}
				],
				"time": "2017-11-26T10:34:56.123Z"
			}
		}
		console.log("yaya");

		//TODO implement parsing of localized alert infos, now only taking the first one
		/*
		const capInfo = _.map(testAlertJson.alert.description, (localInfo) => {
			console.log("1:", localInfo)
			return  {
				language : localInfo.language,
				description : localInfo.text
			}
		});
		*/
		const localizedDescription = (testAlertJson.alert.description) ? testAlertJson.alert.description[0] : null;
		
		const area = constructArea(testAlertJson);

		const capInfo = {
			language: localizedDescription.language,
			category: testAlertJson.alert.category,
			event: testAlertJson.alert.event,
			urgency: testAlertJson.alert.urgency,
			severity: testAlertJson.alert.severity,
			certainty: testAlertJson.alert.certainty,
			senderName: testAlertJson.alert.senderName,
			headline: testAlertJson.alert.headline,
			area: area //TODO add support for multiple areas if needed. Currently we aggregate all points to one area
		}
		console.log("capInfo", capInfo);

		const capXml = {
			alert : {
				identifier: testAlertJson.alert.identifier,
				sender: testAlertJson.alert.sender,
				sent: testAlertJson.alert.sent,
				status: testAlertJson.alert.actual,
				msgType: testAlertJson.alert.msgType,
				scope: testAlertJson.alert.scope,
				info: capInfo
			},
			attr : { namespace : 'lol'}

		};
		console.log(json2xml(capXml, { header: true, attributes_key: 'attr' }));

	};

	produceCap();

/*
<identifier>TRI13970876.2</identifier> 
  <sender>trinet@caltech.edu</sender> 
  <sent>2003-06-11T20:56:00-07:00</sent>
  <status>Actual</status> 
  <msgType>Update</msgType>
  <scope>Public</scope>
  <references>trinet@caltech.edu,TRI13970876.1,2003-06-11T20:30:00-07:00</references>
  <info>
    <category>Geo</category>
    <event>Earthquake</event>   
    <urgency>Past</urgency>   
    <severity>Minor</severity>   
    <certainty>Observed</certainty>
    <senderName>Southern California Seismic Network (TriNet) operated by Caltech and USGS</senderName>
    <headline>EQ 3.4 Imperial County CA</headline>
    <description>A minor earthquake measuring 3.4 on the Richter scale occurred near Brawley, California at 8:30 PM Pacific Daylight Time on Wednesday, June 11, 2003. (This event has now been reviewed by a seismologist)</description>
    <web>http://www.trinet.org/scsn/scsn.html</web>
    <parameter>
      <valueName>EventID</valueName>
      <value>13970876</value>
    </parameter>
    <parameter>
      <valueName>Version</valueName>
      <value>1</value>
    </parameter>
    <parameter>
      <valueName>Magnitude</valueName>
      <value>3.4 Ml</value>
    </parameter>
    <parameter>
      <valueName>Depth</valueName>
      <value>11.8 mi.</value>
    </parameter>
    <parameter>
      <valueName>Quality</valueName>
      <value>Excellent</value>
    </parameter>
    <area>       
      <areaDesc>1 mi. WSW of Brawley, CA; 11 mi. N of El Centro, CA; 30 mi. E of OCOTILLO (quarry); 1 mi. N of the Imperial Fault</areaDesc>
      <circle>32.9525,-115.5527 0</circle>  
    </area>
  </info>*/
'use strict';
const json2xml = require('json2xml');
const _ = require('lodash');
const AWS = require('aws-sdk');
const Feed = require('feed');

function constructAreas(payload) {
	const points = _.map(payload.alert.location, (location) => {
		const circleVal = location.lat+","+location.lon+" "+payload.alert.locationParams.radius;
		return {
			circle : circleVal 
		}
	});

	return {
		areaDesc: "descrption",
		circles: points
	};

}

function createRSSFeed(items, callback) {
	const url = "https://gw-"+process.env.STAGE+".rptf.nitor.zone/alert/get/";
	var feed = new Feed({
		title: 'Alerts',
		description: 'Hacker alerts',
		generator: 'Nitor RPTF'
	});
	_.forEach(items, (item) => {
		console.log("item", JSON.stringify(item));
		const alert = item.alert;
		const localizedDescription = (alert.description) ? alert.description[0] : null;
		feed.addItem({
			title: alert.headline,
			description : localizedDescription.text,
			link : url+item.id,
		});
	});

	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/xml'
		},
		body: feed.rss2()
	}

	console.log("returning response", response);
	callback(null, response);
}

function createXmlFromAlert (testAlertJson, callback) {
	const localizedDescription = (testAlertJson.alert.description) ? testAlertJson.alert.description[0] : null;
	const areas = constructAreas(testAlertJson);
	const capInfo = {
		language: localizedDescription.language,
		category: testAlertJson.alert.category,
		event: testAlertJson.alert.event,
		urgency: testAlertJson.alert.urgency,
		severity: testAlertJson.alert.severity,
		certainty: testAlertJson.alert.certainty,
		senderName: testAlertJson.alert.senderName,
		headline: testAlertJson.alert.headline,
		area: areas 
	}
	console.log("capInfo", capInfo);

	const capXml = {
		alert : {
			identifier: testAlertJson.alert.identifier,
			sender: testAlertJson.alert.sender,
			sent: testAlertJson.alert.sent,
			status: testAlertJson.alert.status,
			msgType: testAlertJson.alert.msgType,
			scope: testAlertJson.alert.scope,
			info: capInfo
		},
		attr : { xmlns : 'urn:oasis:names:tc:emergency:cap:1.2'}

	};
	let xmlOutput = json2xml(capXml, { header: true, attributes_key: 'attr' });
	xmlOutput = xmlOutput.replace('<circles>', '');
	xmlOutput = xmlOutput.replace('</circles>', '');
	xmlOutput = xmlOutput.replace('<?xml version="1.0" encoding="UTF-8"?>', 
	                              '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet href="https://gw-'+process.env.STAGE+'.rptf.nitor.zone/alert/alertstyle.xsl" type="text/xsl"?>');

	console.log(xmlOutput);
	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/xml'
		},
		body: xmlOutput
	}
	callback(null, response);
}

module.exports.produceCap = (event, context, callback) => {
	console.log("event", JSON.stringify(event));
	const db = new AWS.DynamoDB.DocumentClient();
	let testAlertJson;
	var params = {
		Key: {
			id: event.pathParameters.alertId
		}, 
		TableName: process.env.APPROVED_ALERTS_TABLE
	};
	db.get(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else
		{     
			console.log("got data",data);
			testAlertJson = data.Item;
			console.log("data", JSON.stringify(testAlertJson));
			createXmlFromAlert(testAlertJson, callback);
		}
	});
};

module.exports.produceAllCaps = (event, context, callback) => {
	const db = new AWS.DynamoDB.DocumentClient();
	let testAlertJson;
	var params = {
		TableName: process.env.APPROVED_ALERTS_TABLE
	};
	db.scan(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else
		{     
			console.log("got all caps data",data);
			createRSSFeed(data.Items, callback);
		}
	});
};

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
/**
 * AWS = this.props.AWS in React
 */
export const listPendingAlerts = (AWS) => {
  const alert = {
    "type": "security",
    "lon": -115.1697,
    "lat": 36.1212,
    "description": "this is sparta",
    "time": "2017-11-26T10:34:56.123Z"
  }

  const alert2 = {
    "type": "security",
    "lon": -115.1597,
    "lat": 36.1292,
    "description": "this is las vegas",
    "time": "2017-11-26T10:34:56.123Z"
  }

  return Promise.resolve([ alert, alert2 ])

  let docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: window.config.aws.dynamoPendingAlerts,
    KeyConditionExpression: "#s = 'pending'",
    ExpressionAttributeNames: {
      "#s": "status"
    },
  }
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if(err) {
        console.error('Failed to fetch pending alerts', err)
        reject(err)
      }
      resolve(data)
    })
  })
}

export const approveAlert = (AWS, alert) => {
  console.error('approveAlert is not implemented yet')
}

export const rejectAlert = (AWS, alert) => {
  console.error('rejectAlert is not implemented yet')
}

export const geoReverse = ({ lat, lon }) => {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(res => res.json())
}

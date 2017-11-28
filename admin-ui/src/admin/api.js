import _ from 'lodash'

/**
 * AWS = this.props.AWS in React
 */
export const listPendingAlerts = (AWS) => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: window.config.aws.dynamoPendingAlerts,
    /*
    TODO should do some filtering

    FilterExpression: '#s = :pending',
    ExpressionAttributeNames: {
      '#s': 'status'
    },
    ExpressionAttributeValues: {
      ':pending': {S: 'pending'}
    },
    */
  }

  const fixTypes = (item) => {
    console.log('xxx',item)
    item.lat = parseFloat(item.lat)
    item.lon = parseFloat(item.lon)
    return item
  }
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if(err) {
        console.error('Failed to fetch pending alerts', err)
        reject(err)
        return
      }
      console.info('Found data', data.Items)
      // TODO should filter in database
      resolve(_.map(_.filter(data.Items, item => {
        return item.status === 'pending'
      }), fixTypes))
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

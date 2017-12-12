import _ from 'lodash'

const fixTypes = (item) => {
  item.lat = parseFloat(item.lat)
  item.lon = parseFloat(item.lon)
  return item
}

const listAlertsForStatus = (AWS, status) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: window.config.aws.dynamoPendingAlerts,
    IndexName: 'statusIndex',
    KeyConditionExpression: '#s = :pending',
    ExpressionAttributeNames: {
      '#s': 'status'
    },
    ExpressionAttributeValues: {
      ':pending': status
    },
  }

  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if(err) {
        console.error('Failed to fetch pending alerts', err)
        reject(err)
        return
      }
      resolve(_.map(data.Items, fixTypes))
    })
  })
}

/**
 * AWS = this.props.AWS in React
 */
export const listPendingAlerts = (AWS) => {
  return listAlertsForStatus(AWS, 'pending')
}

export const listApprovedAlerts = (AWS) => {
  return listAlertsForStatus(AWS, 'approved')
}

export const listRejectedAlerts = (AWS) => {
  return listAlertsForStatus(AWS, 'rejected')
}

export const approveAlert = (AWS, capAlert, alert) => {
  alert.status = 'approved'
  // geo field got added in UI
  alert.geo = undefined
  const docClient = new AWS.DynamoDB.DocumentClient();
  const approvePromise = new Promise((resolve, reject) => {
    docClient.put({TableName: window.config.aws.dynamoApprovedAlerts, Item: capAlert}, (err, data) => {
      if (err) {
        console.error('Failed to create CAP alert', err)
        reject(err)
        return
      }
      console.info('Created a new CAP alert')
      resolve(data)
    })
  })

  return approvePromise.then(() => {
    return new Promise((resolve, reject) => {
      docClient.put({TableName: window.config.aws.dynamoPendingAlerts, Item: alert}, (err, data) => {
        if (err) {
          console.error('Failed to mark alert approved', err)
          reject(err)
          return
        }
        console.info('Alert marked approved')
        resolve(data)
      })
    })
  })
}

export const rejectAlert = (AWS, alert) => {
  alert.status = 'rejected'
  // geo field got added in UI
  alert.geo = undefined
  const docClient = new AWS.DynamoDB.DocumentClient();
  return new Promise((resolve, reject) => {
    docClient.put({TableName: window.config.aws.dynamoPendingAlerts, Item: alert}, (err, data) => {
      if (err) {
        console.error('Failed to mark alert rejected', err)
        reject(err)
        return
      }
      console.info('Alert marked rejected')
      resolve(data)
    })
  })
}

export const geoReverse = ({ lat, lon }) => {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(res => res.json())
}

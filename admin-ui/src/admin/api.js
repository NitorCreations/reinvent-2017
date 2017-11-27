/**
 * AWS = this.props.AWS in React
 */
export const listPendingAlerts = (AWS) => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  console.log('Alerts table', window.config.aws.dynamoPendingAlerts)
  const params = {
    TableName: window.config.aws.dynamoPendingAlerts,
    /*
    FilterExpression: '#s = :pending',
    ExpressionAttributeNames: {
      '#s': 'Status'
    },
    ExpressionAttributeValues: {
      ':pending': {S: 'pending'}
    },
    */
  }
  return new Promise((resolve, reject) => {
    // TODO this makes full table scan
    docClient.scan(params, (err, data) => {
      if(err) {
        console.error('Failed to fetch pending alerts', err)
        reject(err)
        return 
      }
      console.info('data found,', data)
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

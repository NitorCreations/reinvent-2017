/**
 * AWS = this.props.AWS in React
 */
export const listPendingAlerts = (AWS) => {
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

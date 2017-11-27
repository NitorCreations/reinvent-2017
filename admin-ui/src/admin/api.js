export const listPendingAlerts = (AWS) => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: window.config.aws.dynamoPendingAlerts,
  }
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if(err) {
        console.error('Failed to fetch pending alerts', err)
        reject(err)
      }
      resolve(data)
    })
  })
}


import AWS from 'aws-sdk';

/**
 Update blob to S3 bucket.
 */
function upload(blob) {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const uploadParams = {
    Bucket: window.config.aws.s3Bucket,
    Key: `${Date.now()}.png`,
    Body: blob
  }
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log('upload failed')
      return
    }

    console.log('upload', data)
  })
}

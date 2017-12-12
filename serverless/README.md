# Serverless Backend

## Development

### Install dependencies
```
pip install awscli --upgrade --user
sudo apt-get install jq
```

### Configuration
~/.aws/config:

```
[profile rptf]
output = json
region = us-east-1
```

~/.aws/credentials:
```
[rptf]
aws_secret_access_key = <insert-secret-here>
aws_access_key_id = <insert-access-key-here>
```

### Deploying
```
export AWS_PROFILE=rptf
./up.sh <your-stage-name>
```

NOTES
- Deploying for the first time takes a rather long e.g 15-20 minutes due to CloudFront deployment.
- `up.sh` script has been developed with Linux, results may vary with MacOS.
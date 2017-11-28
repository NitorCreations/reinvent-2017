#!/bin/bash -x

# Stage is $1

function getOutputValue() {
  echo "$1" | jq -r --arg key "$2" '.|map(select(.OutputKey == $key))|.[0].OutputValue'
}


if [ -z "$1" ]; then
    STAGE=""
    STACK_STAGE=""
else
    STAGE="-s $1"
    STACK_STAGE="-$1"
fi


cd serverless

sls deploy $STAGE

STACK_NAME="aws-nodejs${STACK_STAGE}"

cd -

OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" | jq -r '.Stacks[0].Outputs')

USER_POOL_ID=$(getOutputValue "$OUTPUTS" "UserPoolId")
APP_CLIENT_ID=$(getOutputValue "$OUTPUTS" "ClientId")
IDENTITY_POOL_ID=$(getOutputValue "$OUTPUTS" "IdentityPoolId")
FRONTEND_BUCKET=$(getOutputValue "$OUTPUTS" "FrontendBucket")
APPROVED_TABLE=$(getOutputValue "$OUTPUTS" "DDBTableApproved")
NOT_APPROVED_TABLE=$(getOutputValue "$OUTPUTS" "DDBTableNotApproved")

cd admin-ui

yarn install

yarn run build-css
yarn run build

cd build

#  "identityPoolId": "us-east-1:1e166dad-bd15-4e39-9700-68c9c1305906",
#  "userPoolId": "us-east-1_0QbddCzbp",
#  "clientId": "apef76d7ojassafva35o5tap2",
#  "dynamoPendingAlerts": "aws-nodejs-riki3-DDBTableNotApproved-689LKZKDLM2Z",
#  "dynamoApprovedAlerts": "aws-nodejs-riki3-DDBTableApproved-18O0SSFMUK6QT"
sed -i -e "s/us-east-1_0QbddCzbp/$USER_POOL_ID/g" -e "s/apef76d7ojassafva35o5tap2/$APP_CLIENT_ID/g" \
	-e "s/us-east-1:1e166dad-bd15-4e39-9700-68c9c1305906/$IDENTITY_POOL_ID/g" \
	-e "s/aws-nodejs-riki3-DDBTableNotApproved-689LKZKDLM2Z/$NOT_APPROVED_TABLE/g" \
	-e "s/aws-nodejs-riki3-DDBTableApproved-18O0SSFMUK6QT/$APPROVED_TABLE/g" \
	config.json

aws s3 sync --acl=public-read . s3://$FRONTEND_BUCKET



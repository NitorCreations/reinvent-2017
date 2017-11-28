#!/bin/bash

# Stage is $1

function getOutputValue() {
    return $(echo "$1" | jq -r --arg key "$2" '. | map(select(.OutputKey == "$key"))')
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

STACK-NAME="aws-nodejs${STACK_STAGE}"

cd -

OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" | jq -r '.Stacks[0].Outputs')

USER_POOL_ID=$(getOutputValue "$OUTPUTS" "UserPoolId")
APP_CLIENT_ID=$(getOutputValue "$OUTPUTS" "ClientId")
IDENTITY_POOL_ID=$(getOutputValue "$OUTPUTS" "IdentityPoolId")
FRONTEND_BUCKET=$(getOutputValue "$OUTPUTS" "FrontendBucket")

cd admin-ui

yarn install

yarn run build

cd build # TODO: Check this!

aws s3 sync --acl=public-read . s3://$FRONTEND_BUCKET



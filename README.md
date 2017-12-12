# AWS Reinvent 2017


## Architecture

TODO

## Installing
Install awscli and jq

```
pip install awscli --upgrade --user
sudo apt-get install jq```

## Configuration
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

## Running the backend and the ui
```
cd serverless
yarn install
cd ..
cd admin-ui
yarn install
cd ..
export AWS_PROFILE=rptf

./up.sh <your-stage-name>

cd admin-ui
yarn run start
```

TODO

## Hackaton Team

- Pasi Niemi
- Michal Lison
- Timo Tenhunen
- Björn Heselius
- Richard Weber
- Jukka Miettinen
- Antti Turunen
- Juha Syrjälä

from [Nitor](https://www.nitor.com)

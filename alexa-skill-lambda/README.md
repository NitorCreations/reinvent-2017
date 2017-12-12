# Lambda for Alexa skill

Written for Node.js (6.10), this code is to be used as Alexa skill for reporting alerts.
It uses a small set of pre-defined interactions (intents) to ask user what they wish to report. Afterwards, it resolves user's location and creates an alert in the database.

## Setup

This guide describes how to install and develop the skill, production use and distribution of the skill is not covered in this document.

### Prerequisites

Your Alexa device and your AWS account need to be registered to the same account (email address). Otherwise you won't be able to use custom skills, i.e. skills that are not published in Alexa Skill Marketplace. You'll also need to to register for an [Amazon Developer Account](https://developer.amazon.com/), ideally registered to the same address.

This skill requires premission to use device address (configured in [skill configuration](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw)). The address is defined in [Alexa settings](https://alexa.amazon.com/spa/index.html#settings) (Device configuration).

### Creating Alexa skill
1. Navigate to developer portal, [Alexa section](https://developer.amazon.com/edw/home.html#/skills).
1. Add new skill and fill in required metadata
1. Use Skill Builder to create an interaction model. Use combination of built-in and custom intents - these define phrases and words that your Alexa skill will understand and respond to.
1. Configure your skill in Configuration section. Most notably, you need to fill in ARN of the Lambda which contains your interaction handlers, as well as enable permissions to access device address

Once done, you can use Service Simulator to verify how your skill responds

### Creating Lambda

1. Install required npm dependencies by running `npm install` in this folder (`alexa-skill-lambda/`)
1. Navigate to [Lambda home](https://eu-west-1.console.aws.amazon.com/lambda/home) in your AWS Console and create a new function
1. Add `Alexa Skills Kit` as a trigger and configure skill ID
1. Update configuration properties in `index.js` to contain correct app ID and API path
1. Upload the code from this folder - either manually file by file, or just zip all files and upload the archive
1. Go configure the Alexa Skill to use this Lambda's ARN as it's endpoint

---

After this, your skill should be connected your Lambda, and the skill should be available in your Alexa skill configuration. By this point, Alexa should be able to recognize your trigger phrase (configured in skill settings), and should be able to trigger your intent handlers as specified in the Lambda function.

## TODOs

- automate deployment, make this part of the stack
- pass in configuration from env / stack variables
- use natural language as input for alert type so that they don't need to be defined manually as intents / handlers

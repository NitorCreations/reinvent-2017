# Lambda for Alexa skill

Written for Node.js, this code is to be used as Alexa skill for reporting alerts.
It uses a small set of pre-defined interactions (intents) to ask user what they want to report, and afterwards resolves user's location.

## Setup

This guide describes how to install and develop the skill, production use and distribution of the skill is not covered in this document.

### Prerequisites

Your Alexa device and your AWS account need to be registered to the same account (email address). Otherwise you won't be able to use custom skills, i.e. skills that are not published in Alexa Skill Marketplace. You'll also need to to register for an [Amazon Developer Account](https://developer.amazon.com/), ideally registered to the same address.

This skill requires premission to use device address (configured in [skill configuration](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw)). The address needs to be defined in [Alexa settings](https://alexa.amazon.com/spa/index.html#settings) (Device configuration).

### Creating Alexa skill
1. Navigate to developer portal, [Alexa section](https://developer.amazon.com/edw/home.html#/skills).
1. Add new skill and fill in required metadata
1. Use Skill Builder to create an interaction model. Use combination of built-in and custom intents - these define the phrases and words that your Alexa skill will understand and respond to.
1. Configure your skill in Configuration section. Most notably, you need to configure ARN of your Lambda that contains your interaction handlers, and also enable permissions to access device address

Afterwards, you can use Service Simulator to verify how your skill responds

### Creating Lambda

1. 

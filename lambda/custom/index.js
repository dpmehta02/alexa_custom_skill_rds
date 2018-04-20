/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

/* * * Databse helpers * * */
function createDatabaseConnection() {
  // only invoke in functions that require it.
  // var pg = require('pg');
  // var conn = "pg://user:password@host:5432/bd_name";
  // var client = new pg.Client(conn);
  // client.connect();
}

function getUserChains(userID) {
  return userID;
}

/* * * Handlers * * */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    createDatabaseConnection();
    // const userID = handlerInput. ...
    const userChains = getUserChains(handlerInput);

    let cardText;
    let speechText;
    if (userChains.size === 0) {
      // TODO: Tell user to check alexa app for link to create chains
      // and (return card w/ link to companion app).
      speechText = '';
      cardText = 'http://www.companionapp.io'; // TODO: update with real domain.
    } else { // If does, ask which chain to trigger. Your current chains are ..., ..., .
      // TODO: Return custom audio in place of this and move this string to cardText
      speechText = 'Welcome to Daisy Chains! Which chain would you like to trigger? Your choices are ... .';
      cardText = speechText;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Daisy Chains', cardText) // https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#overview-of-cards
      .getResponse();
  },
};

const TriggerChainIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TriggerChainIntent';
  },
  handle(handlerInput) {
    const chainName = handlerInput.requestEnvelope.request.intent.slots.ChainName.value;

    // Query DB, get chain
    const chainQueryResult = chainName;
    let speechText;
    if (chainQueryResult) {
      // Trigger events
      // Say 'success'
      speechText = 'Triggered <CHAIN_NAME> chain with the following events: <EVENTS>';
      // exit app?
    } else {
      speechText = 'Invalid chain name. Your available chains are <LIST_ALL_CHAINS>';
      // await response
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Daisy Chains', 'Triggered <CHAIN_NAME> chain with the following events: <EVENTS>')
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Chain multiple actions together with a custom phrase. Visit <LINK> to set up your first chain.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Daisy Chains', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Peace!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TriggerChainIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const db = require('./db');

/**
 * Responses
 */
const ERROR_TEXT = 'Uh oh, there was an error. Please try again.';
const NO_CHAIN_TEXT = 'You don\'t have any chains. Create some now in the link sent to your Alexa app. GET HYPE!';
const COMPANION_APP_URI = 'http://www.companionapp.io'; // TODO: update with real domain.
const HELP_TEXT = `Chain multiple actions together with a custom phrase. Visit ${COMPANION_APP_URI} to set up your first chain.`;
const GOODBYE_TEXT = 'Goodbye!';
const CARD_TITLE = 'Daisy Chains';
const PLEASE_REPEAT_TEXT = 'I didn\'t understand your command. Please repeat it.';

/**
 * Handlers
 */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const { userId } = handlerInput.requestEnvelope.session.user;

    let cardText;
    let speechText;
    db.query(`SELECT * from users where id = ${userId};`, (err, res) => {
      if (err) {
        speechText = ERROR_TEXT;
        cardText = ERROR_TEXT;
        console.log(err.stack);
      // Tell user to create chains
      } else if (res.rows === 0) {
        speechText = NO_CHAIN_TEXT;
        cardText = COMPANION_APP_URI;
      // List user chains
      } else {
        // TODO: Return custom audio in place of this and move this string to cardText
        speechText = 'Welcome to Daisy Chains! Which chain would you like to trigger? Your choices are ... .';
        cardText = speechText;
        // await reponse?
      }
    });
    db.closeConn(); // Is this necessary? Also, we should move this higher.

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(CARD_TITLE, cardText) // https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#overview-of-cards
      .getResponse();
  },
};

const TriggerChainIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TriggerChainIntent';
  },
  handle(handlerInput) {
    const { userId } = handlerInput.requestEnvelope.session.user;
    const chainName = handlerInput.requestEnvelope.request.intent.slots.ChainName.value;

    let speechText;
    let cardText;
    const chainQuery = `SELECT * FROM chains INNER JOIN events ON (chains.id = events.chain_id) WHERE name = ${chainName} and user_id = ${userId};`;
    db.query(chainQuery, (err, res) => {
      if (err) {
        speechText = ERROR_TEXT;
        cardText = ERROR_TEXT;
        console.log(err.stack);
      // Specified chain doesn't exist
      } else if (res.size === 0) {
        speechText = 'We couldn\'t find that chain. Your available chains are <LIST_ALL_CHAINS>';
        cardText = 'placeholder';
        // await response
      // Trigger the chain and exit the app
      } else {
        // Trigger events
        speechText = 'Triggered <CHAIN_NAME> chain. See the Alexa App for a list of the events triggered.';
        cardText = 'placeholder';
        // exit app
      }
    });
    db.closeConn();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(CARD_TITLE, cardText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_TEXT)
      .reprompt(HELP_TEXT)
      .withSimpleCard(CARD_TITLE, HELP_TEXT)
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
    return handlerInput.responseBuilder
      .speak(GOODBYE_TEXT)
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
      .speak(PLEASE_REPEAT_TEXT)
      .reprompt(PLEASE_REPEAT_TEXT)
      .getResponse();
  },
};

/**
 * Skill definition
 */
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
  // .withApiClient()
  .lambda();

// Service clients can be used in any request handler, exception handler, and
// request and response interceptor. The ServiceClientFactory contained inside the
// HandlerInput allows you to retrieve client instances for every supported Alexa
// service. The ServiceClientFactory are only available when you configure the
// skill instance with an ApiClient.
//
// The following example shows the handle function for a request handler that
// creates an instance of the device address service client. Creating a service
// client instance is as simple as calling the appropriate factory function.
//
// const handle = async function(handlerInput) {
//       const { requestEnvelope, serviceClientFactory } = handlerInput;
//       const { deviceId } = requestEnvelope.context.System.device;
//       const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
//       const address = await deviceAddressServiceClient.getFullAddress(deviceId);
//       // other handler logic goes here
// }

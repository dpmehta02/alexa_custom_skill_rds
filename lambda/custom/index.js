/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const db = require('./db');

/* * * Handlers * * */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('in launch request handler');
    const { userId } = handlerInput.requestEnvelope.session.user;
    console.log(`User id: ${userId} ------`);
    let cardText;
    let speechText;
    // where id - userid
    db.query(`SELECT * from users where id = ${userId};`, (err, res) => {
      if (err) {
        speechText = 'Sorry, there was an error. Please try again.';
        cardText = 'Sorry, there was an error. Please try again.';
        console.log(err.stack);
      } else {
        console.log('above res.fields');
        console.log(res.fields);
        console.log('above res.rows');
        console.log(res.rows);
        const userChains = res.rows;
        if (userChains.size === 0) {
          // TODO: Tell user to check alexa app for link to create chains
          // and (return card w/ link to companion app).
          speechText = 'You don\'t have any chains. Create some now in the link sent to your Alexa app. GET HYPE!';
          cardText = 'http://www.companionapp.io'; // TODO: update with real domain.
        } else {
          // TODO: Return custom audio in place of this and move this string to cardText
          speechText = 'Welcome to Daisy Chains! Which chain would you like to trigger? Your choices are ... .';
          cardText = speechText;
        }
      }
      db.closeConn(); // Is this necessary? Also, we should move this higher.
    });

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
    console.log('in trigger chain intent handler');
    const chainName = handlerInput.requestEnvelope.request.intent.slots.ChainName.value;
    console.log(`chain Name: ${chainName} in trigger chain intent handler`);

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
    console.log('in help intent handler');
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
    console.log('in error handler');
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

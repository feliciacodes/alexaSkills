const Alexa = require('ask-sdk-core');
const skillBuilder = Alexa.SkillBuilders.custom();

/* CONSTANTS */
const BreakfastClub = require('Movies/TheBreakfastClub');
const HarryPotter = require('Movies/HarryPotter');

const movieScenes = {'THE BREAKFAST CLUB': BreakfastClub,
                    'HARRY POTTER AND THE SORCERER\'S STONE': HarryPotter
                    };

/* INTENT HANDLERS */

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Ok. What movie would you like to reenact a scene from?')
      .reprompt()
      .getResponse();
  },
};

// Called once the user selects a movie
const MovieSceneHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    
    return request.type === 'IntentRequest'
      && request.intent.name === 'MovieScene';
  },
  handle(handlerInput) {
    const sessionAttributes = {};
    Object.assign(sessionAttributes,{
      'lineCounter' : 0,
      'sceneOver' : false,
      'movie' :  handlerInput.requestEnvelope.request.intent.slots.movie.value
    });
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return handlerInput.responseBuilder
      .speak('Ok. Say Action when you\'re ready')
      .reprompt()
      .getResponse();
  },
};

// Called once the user has selected a movie and says Action
const ActionHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'Action';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const movie = sessionAttributes.movie.toUpperCase();
    const lines = getLines(movie);
    
    return handlerInput.responseBuilder.speak(lines[0]).reprompt().getResponse();
  }
};

// Called when a user says a line from the provided list
const LinesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const sceneOver = sessionAttributes.sceneOver;
    return !sceneOver && request.type === 'IntentRequest'
      && request.intent.name === 'UserLine';
  },
  handle(handlerInput) {
    
    return nextLine(handlerInput);
  }
};

// Called when a user needs help
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' 
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('We are playing the movie scene game. What movie do you want to reenact?')
      .reprompt('Pick a movie to reenact.')
      .getResponse();
  },
};

// Called when the user stops the game or declares "End Scene"
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const movie = sessionAttributes.movie.toUpperCase();
    const lines = getLines(movie);
    var lineCounter = sessionAttributes.lineCounter;
      lineCounter++;
    
    if (lineCounter < lines.length) {
      Object.assign(sessionAttributes, {
        sceneOver: true
      });
      return handlerInput.responseBuilder.speak('I wasn\'t done but okay').getResponse();
    }
    else {
      return handlerInput.responseBuilder.speak('Great job. You\'re a star').getResponse();
    }
  },
};

// Default handler from blueprint
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

// Default handler from blueprint
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


/* HELPER FUNCTIONS */
function getLines(movie){
    return movieScenes[movie];
}

// Checks to see if the line is correct or not
// If the line is correct, Alexa responds with the next line
// If the line is incorrect, Alexa says something sarcastic and ends the scene
function nextLine(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const movie = sessionAttributes.movie.toUpperCase();
  const lines = getLines(movie);
  var lineCounter = sessionAttributes.lineCounter;
  var response = handlerInput.requestEnvelope.request.intent.slots.line.value.toUpperCase();
  lineCounter++;
        
  //middle of scene
  if (lineCounter < lines.length) {
      // correct response
      if (response === lines[lineCounter].toUpperCase()) {
        // proceed to the next line
        lineCounter++;
        Object.assign(sessionAttributes, {
          lineCounter: lineCounter
        });
        return handlerInput.responseBuilder.speak(lines[lineCounter]).reprompt().getResponse();
      }
      // incorrect response
      else {
        Object.assign(sessionAttributes, {
          sceneOver: true
        });
        return handlerInput.responseBuilder.speak('That\'s not your line. I can\'t work with you.').getResponse();
      }
  }
  // end of scene
  else {
    Object.assign(sessionAttributes, {
      sceneOver: true
    });
      return handlerInput.responseBuilder.speak('I don\'t know anymore lines. This is awkward.').getResponse();
  }
}

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    MovieSceneHandler,
    ActionHandler,
    LinesHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler, 
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

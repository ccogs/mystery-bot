let FirstEntity = require('../nlp_helpers').firstEntity;
let BotHook = require('./bot_module');

class GreetingHook extends BotHook
{
    /*
    Queries the bot to determine if the event should be handled by this hook.
    Param:
        event: The event object from the facebook api
        message: event.message.text from the same event
     Returns true if this hook should be called, false otherwise.
     */
    handlesMessage(event, message){
        const greeting = FirstEntity(event.message.nlp, 'greetings');
        if (greeting && greeting.confidence > 0.8) {
            console.log("Identified greeting.");
            return true;
        }
        return false;
    }

    /*
    Tells the bot to send their response given the event and message.
    This will only be called when handlesMessage returns true.
    Param:
        event: The event object form the facebook api
        requestMessage: event.message.text from the request event
        writeCallback: The callback that should be passed the response object as a parameter.
     Returns true if the processing should stop, false otherwise.
     */
    respond(event, requestMessage, writeCallback){
        let text = 'Detected greeting. Hi there!';
        writeCallback({text: text});
        return true;
    }
}

module.exports = GreetingHook;
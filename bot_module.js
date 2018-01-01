'use strict';

class BotHook {
    /*
    Queries the bot to determine if the event should be handled by this hook.
    Param:
        event: The event object from the facebook api
        message: event.message.text from the same event
     Returns true if this hook should be called, false otherwise.
     */
    handlesMessage(event, message){
        throw new Error("Handle Message not implemented for the base class BotHook");
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
        throw new Error("respond not implemented for the base class BotHook");
    }
}

module.exports = BotHook;
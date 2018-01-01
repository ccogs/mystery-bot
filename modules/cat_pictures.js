let BotHook = require('./bot_module');

class CatHook extends BotHook {
    /*
    Queries the bot to determine if the event should be handled by this hook.
    Param:
        event: The event object from the facebook api
        message: event.message.text from the same event
     Returns true if this hook should be called, false otherwise.
     */
    handlesMessage(event, message) {
        return message === "cat"
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
    respond(event, requestMessage, writeCallback) {
        console.log("Identified cat request.");
        const catUrl = "http://thecatapi.com/api/images/get?format=src";

        const message = {
            attachment: {
                type: "image",
                payload: {
                    url: catUrl,
                    is_reusable: true
                }
            }
        };
        writeCallback(message);
        return true;
    }
}

module.exports = CatHook;
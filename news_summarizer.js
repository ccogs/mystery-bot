'use strict';
// This is required because the author of node-summary did not correctly
// make it transpiled from es6
require('babel-node-modules')([
    'node-summary' // add an array of module names here
]);
let summary = require('node-summary');
let requestPromise = require("request-promise");
let BotHook = require('./bot_module');


function _getSummaryFromUrl(url) {
    // convert summary.summarizeFromUrl to use promises instead of a callback
    return new Promise(function (resolve, reject) {
        summary.summarizeFromUrl(url, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

function _lookupRandomArticle() {
    function randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let options = {
        uri: 'https://newsapi.org/v2/everything',
        qs: {
            apiKey: process.env.NEWS_API_TOKEN,
            from: date,
            sources: 'bloomberg,bbc-news,hacker-news,reuters,the-hill,time,the-washington-post,abc-news,cnn'
        },
        json: true // Automatically parses the JSON string in the response
    };
    let req =  new requestPromise(options);
    return req
        .then(function(response) {
            let results = response.articles;
            let len = results.length;
            if (len === 0){
                return "https://www.lipsum.com/"
            }
            return results[randomInt(0, len)].url
        });
}
class SummaryHook extends BotHook
{
    /*
    Queries the bot to determine if the event should be handled by this hook.
    Param:
        event: The event object from the facebook api
        message: event.message.text from the same event
     Returns true if this hook should be called, false otherwise.
     */
    handlesMessage(event, message){
        return message === "news"
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
        _lookupRandomArticle().then(
            function (url) {
                _getSummaryFromUrl(url).then(function (sum) {
                    let message = {
                        text: url + '\n\n' + sum
                    };
                    writeCallback(message);
                }).catch(function (error) {
                    console.log(error);
                });
            });
        return true;
    }
}

module.exports = SummaryHook;
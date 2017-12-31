var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let newsSummarizer = require('./news_summarizer');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));


console.log('The news Summarizer is');
console.log(newsSummarizer);

/*
A list of response modules that will allow additional functionality to be added on.
The entry functions take the following parameters:
1.) The submission id
2.) The message sent
3.) The function to write a response message:
      parameters:
        1.) submission id (TODO just make it take the sumission id on the function binding)
        2.) The message to respond.
 */
let responseModules = [newsSummarizer];



function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// Server index page
app.get("/", function (req, res) {
  res.send("All is good!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// calls our helper functions
// we care about two types: messages & postbacks
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
      	if (event.message && event.message.text) {
            respondToUser(event);
        }
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

// I found this code on a tutorial for fb messenger
function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hello Person. I see your name is: " + name + ". ";
      }
      var message = greeting + "This is the initial message. ";
      sendMessage(senderId, {text: message});
    });
  }
}

// utility function. sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

function respondToUser(event) {
	var senderId = event.sender.id;
 	var message = event.message.text;

  console.log("nlp: " + event.message.nlp);
  const greeting = firstEntity(event.message.nlp, 'greetings');
  console.log(greeting);
  if (greeting && greeting.confidence > 0.8) {
    console.log("Identified greeting.");
    var text = 'Detected greeting. Hi there!';
    sendMessage(senderId, {text: text});
    return;
  }

  if (message === "cat") {
    sendCatPicture(senderId);
    return;
  }
  for (const entry in responseModules) {
        console.log(entry);
        if (entry(senderId, message, sendMessage)){
          return;
        }
  }

 	var text = "echoing: " + message;
 	sendMessage(senderId, {text: text});
}

function sendCatPicture(senderId) {
  console.log("Identified cat request.");
  var catUrl = "http://thecatapi.com/api/images/get?format=src";
  
  var message = {
    attachment: {
      type: "image",
      payload: {
        url: catUrl,
        is_reusable: true
      }
    }
  };

  sendMessage(senderId, message);
}

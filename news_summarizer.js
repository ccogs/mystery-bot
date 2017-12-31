// This is requires because the author of node-summary did not correctly
require('babel-node-modules')([
    'node-summary' // add an array of module names here
]);
let summary = require('node-summary');


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
    let url = 'https://newsapi.org/v2/everything?' +
        'from=' + date + '&'+
        'sortBy=popularity&' +
        'apiKey=' + process.env.NEWS_API_TOKEN;
    let req =  new Request(url);
    return fetch(req)
        .then(function(response) {
            let results = response.articles;
            let len = results.length;
            if (len === 0){
                return "https://www.lipsum.com/"
            }
            return results[randomInt(0, len)].url
        });
}
function entry(senderid, message, writeMessage) {
    if (message === 'news') {
        _lookupRandomArticle().then(
        function (url) {
            _getSummaryFromUrl(url).then(function (sum) {
                message = {
                    text: url + '\n\n' + sum
                };
                writeMessage(senderid, message);
            }).catch(function (error) {
                console.log(error);
            });
        });
        return true;
    }
    return false;
}

module.exports = entry;
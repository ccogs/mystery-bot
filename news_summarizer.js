// This is requires because the author of node-summary did not correctly
require('babel-node-modules')([
    'node-summary' // add an array of module names here
]);
let summary = require('node-summary');


function _getSummaryFromUrl(url) {
    // convert summary.summarizeFromUrl to use promises instead of a callback
    return new Promise(function (resolve, reject) {
        summary.summarizeFromUrl(url, function (err, data) {
            if (err !== null) return reject(err);
            resolve(data);
        });
    });
};

function _lookupRandomArticle() {
    // TODO make non random hardcoded URL
    return 'https://www.nytimes.com/2017/12/29/dining/raw-water-unfiltered.html';
};


function entry(senderid, message, writeMessage) {
    if (message === 'news') {
        let url = _lookupRandomArticle();
        let sum = _getSummaryFromUrl(url);
        message = {
            text: url + '\n\n' + sum
        };
        writeMessage(senderid, message);
        return true;
    }
    return false;
}

module.exports = entry;
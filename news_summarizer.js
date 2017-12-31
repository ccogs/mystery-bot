require('babel-node-modules')([
    'node-summary' // add an array of module names here
]);
let summary = require('node-summary');



let _getSummaryFromUrl = function (url) {
    // convert summary.summarizeFromUrl to use promises instead of a callback
    return new Promise(function (resolve, reject) {
        summary.summarizeFromUrl(url, function (err, data) {
            if (err !== null) return reject(err);
            resolve(data);
        });
    });
};

let _lookupRandomArticle = function() {
    // TODO make non random hardcoded URL
    return 'https://www.nytimes.com/2017/12/29/dining/raw-water-unfiltered.html';
};




module.exports = {
    entry: function (senderid, message, writeMessage) {
        if(message === 'news'){
            let url = _lookupRandomArticle();
            let sum = _getSummaryFromUrl(url);
            message = {
                text : url +'\n\n' +  sum
            };
            writeMessage(senderid, message);
            return true;
        }
        return false;
    }

};
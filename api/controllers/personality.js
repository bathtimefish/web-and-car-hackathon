'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var watson = require('watson-developer-cloud');

var personality_insights = watson.personality_insights({
    username: 'c03ee0e7-eebf-469e-8e5f-06559cac835e',
    password: '75IKpGqKF19V',
    version: 'v2'
});

var getProfile = function(my_profile) {
    return new Promise(function(resolve, reject) {
        personality_insights.profile({ text: my_profile }, function (err, profile) {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                console.log(profile);
                resolve(profile);
            }
        });
    });
};

/* routers */
module.exports = {
  personality_insights: personality,
  personality_help: help
};

function personality(req, res) {
    var content = req.swagger.params.text.value;

    getProfile(content).then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.status(400).json(err);
    });
}

function help(req, res) {
    res.json({"name": "Watson Personality Insights API wrapper API", "version": "1.0.0"});
}


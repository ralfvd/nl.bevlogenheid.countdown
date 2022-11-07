const severity = {
    debug: 1,
    info: 2,
    warning: 3,
    error: 4,
    critical: 5
};
exports.severity = severity;

const Log = require('homey-log').Log;

exports.findVariable = function (partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.type === type;
    }
}

exports.filterVariable = function(partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.type === type;
    }
}

exports.value_exist = function (string) {
    //noinspection RedundantIfStatementJS
    if (typeof string != 'undefined' && string != null) return true;
    else return false;
};

/**
 * Logs the message to console.
 * When the severity is error or above the message will also be logged to Athom online logging (Sentry atm).
 * @param {string} message Message to log
 * @param {int} level Message priority level
 */
exports.cdLog = function (message, level) {
    if (!this.value_exist(level)) level = severity.debug;
    if (level >= severity.error) Log.captureMessage(message);
    console.log(message);
};

/**
 * Helper function to generate unique ID
 * @returns {string} Returns unique ID
 */
exports.generateUniqueId = function () {
    var uuid = require('node-uuid');
    return uuid.v4();
};

exports.contains = function(partialWord) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1;
    }
}

exports.buildExpression = function (expression) {
    var variableManager = require('../variablemanagement/variablemanagement.js');
    var arr = [],
        re = /(\$.*?\$)/g,
        item;

    while (item = re.exec(expression))
        arr.push(item[1]);
    //console.log(arr);

    arr.forEach(function (item) {
        var variableName = item.replace(/\$/g, "");
        var variable = {};
        //console.log("Variable Name: " + variableName);
        if (variableName == 'timenow') {
            variable.value = Math.floor(Date.now() / 1000);
        } else {
            variable = variableManager.getvariable(variableName);
        }
        //console.log("Variable value: " + variable.value);
        expression = expression.replace(item, variable.value);
    });
    return expression;
}

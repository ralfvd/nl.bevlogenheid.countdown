var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteConditions = function () {

	Homey.manager('flow').on('condition.timer_running.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });

  Homey.manager('flow').on('condition.timer_matches_number.variable.autocomplete', function (callback, value) {
          callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
      });
}

"use strict";

var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');

var autoCompleteActions = require('./lib/autocomplete/actions.js');
var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
var autoCompletetriggers = require('./lib/autocomplete/triggers.js');

var flowActions = require('./lib/flow/actions.js');
var flowConditions = require('./lib/flow/conditions.js');
var flowTriggers = require('./lib/flow/triggers.js');

var self = {
  init: function() {
	Homey.log("CountDown started");
	variableManager.init();

	autoCompleteActions.createAutocompleteActions();
        autoCompleteConditions.createAutocompleteConditions();
        autoCompletetriggers.createAutocompleteTriggers();
	
	flowActions.createActions();
	flowConditions.createConditions();
	flowTriggers.createTriggers();

	setInterval(timers_update.bind(this),5*1000);
	function timers_update() {
		//Homey.log("Test 1 2 3" );
		var currentVariables= variableManager.getVariables();
		//Homey.log(currentVariables);
	        currentVariables.forEach(function( obj) {
		 	//Homey.log(obj.name);
			//Homey.log(obj.value);
			if (obj.value == 0) {
				Homey.log("Value triggered: ",obj.value);
				// Homey.manager('flow').trigger('countdown_test');
				var tokens = { 'variable' : obj.name };
				var state = { 'variable' : obj.name };
				Homey.log(tokens);	
				Homey.log(state);
				Homey.manager('flow').trigger('countdown_to_zero', tokens, state, function(err, result){
    					if( err ) return Homey.error(err);
				}); 
				//variableManager.updateVariable(obj.name,-1,'number');
			}
			if (obj.value > 0) {
				variableManager.updateVariable(obj.name, obj.value - 1, 'number');
			}
		});
		//var variable = variableManager.getVariable('testCD');
		//if(variable){
		//variableManager.updateVariable('testCD', variable.value - 1, 'number');
		//};
	};
  }
}


module.exports = self;

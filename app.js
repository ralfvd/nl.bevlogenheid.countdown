"use strict";

var fs = require('fs');
var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');

var autoCompleteActions = require('./lib/autocomplete/actions.js');
var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
var autoCompleteTriggers = require('./lib/autocomplete/triggers.js');

var flowActions = require('./lib/flow/actions.js');
var flowConditions = require('./lib/flow/conditions.js');
//var flowTriggers = require('./lib/flow/triggers.js');

var self = {
  init: function() {
	Homey.log("CountDown started");
	variableManager.init();

	autoCompleteActions.createAutocompleteActions();
  autoCompleteConditions.createAutocompleteConditions();
  autoCompleteTriggers.createAutocompleteTriggers();

	flowActions.createActions();
	flowConditions.createConditions();

        Homey.manager('flow').on('trigger.countdown_to_zero', function (callback,args,state) {
        if ( args.variable.name == state.variable ) {
                callback(null,true);
                return;
           } else {
                callback(null, false); // true to make the flow continue, or false to abort
         }
        });

        Homey.manager('flow').on('trigger.countdown_started', function (callback,args,state) {
        if (args.variable.name == state.variable) {
          callback(null,true);
          return;
         } else {
        callback(null, false); // true to make the flow continue, or false to abort
        }
        });

        Homey.manager('flow').on('trigger.countdown_stopped', function (callback,args,state) {
        if ( args.variable.name == state.variable ) {
            callback(null,true);
            return;
         } else {
        callback(null, false); // true to make the flow continue, or false to abort
        }
        });


	var currentVariables= variableManager.getvariables();
  Homey.log(currentVariables.length);
	setInterval(timers_update,1000);
	function timers_update() {
		var currentVariables= variableManager.getvariables();
		//Homey.log(currentVariables);
	        currentVariables.forEach(function( obj) {
		 	//Homey.log(obj.name);
			//Homey.log(obj.value);
			if (obj.value == 0) {
				//Homey.log("Value triggered: ",obj.value);
				// Homey.manager('flow').trigger('countdown_test');
				var tokens = { 'variable' : obj.name };
				var state = { 'variable' : obj.name };
				Homey.manager('flow').trigger('countdown_to_zero', tokens, state);
				variableManager.updatevariable(obj.name,'-1','number','');
			}
			if (obj.value > 0) {
				variableManager.updatevariable(obj.name, obj.value - 1, 'number','');
			}
		});
	};
  }
}


module.exports = self;

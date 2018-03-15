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
const Log = require('homey-log').Log;
const severity = util.severity;

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

        Homey.manager('flow').on('trigger.countdown_timer_changed', function (callback,args,state) {
        if ( args.variable.name == state.variable ) {
            //Homey.log(args);
            callback(null,true);
            return;
         } else {
        callback(null, false); // true to make the flow continue, or false to abort
        }
        });


	var currentVariables= variableManager.getvariables();
  Homey.log(currentVariables.length);
  var uniqueUserId = Homey.manager('settings').get('uniqueUserId');
  Homey.log(uniqueUserId);
        if (!util.value_exist(uniqueUserId)) {
            uniqueUserId = util.generateUniqueId();
            Homey.manager('settings').set('uniqueUserId', uniqueUserId);
            util.cdLog('Generating new unique user ID: ' + uniqueUserId, severity.debug);
        }
        util.cdLog('Unique user ID: ' + JSON.stringify(uniqueUserId), severity.debug);
        Log.setUser({
          id: uniqueUserId
        });
        Log.setTags({
          timers: currentVariables.length
        })
  Log.captureMessage("Countdown app started with variables:" + currentVariables.length, { level: 'info'});
  
// Log mem+cpu warnings to Sentry
  Homey.on('memwarn', function( data ){
    console.log('memory above 100mb')
    console.log('count: ' +  data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
    util.cdLog('Memory warning: ' + JSON.stringify(currentVariables), severity.error)

});

  Homey.on('cpuwarn', function( data ){
  console.log('cpu above 80%')
  console.log('count: ' +  data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
  util.cdLog('CPU warning: ' + JSON.stringify(currentVariables), severity.error)

  });

	setInterval(timers_update,1000);
	function timers_update() {
		var currentVariables= variableManager.getvariables();
		//Homey.log(currentVariables);
	        currentVariables.forEach(function( obj) {
		 	//Homey.log(obj.name);
			//Homey.log(obj.value);
      var tokens = { 'variable' : obj.name, 'value' : obj.value };
      var state = { 'variable' : obj.name };
      if (obj.value == 0) {
				//Homey.log("Value triggered: ",obj.value);
				// Homey.manager('flow').trigger('countdown_test');
				//var tokens = { 'variable' : obj.name };
				//var state = { 'variable' : obj.name };
				Homey.manager('flow').trigger('countdown_to_zero', tokens, state);
        Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
	  		variableManager.updatevariable(obj.name,-1,'number','');
			}
			if (obj.value > 0) {
				variableManager.updatevariable(obj.name, obj.value - 1, 'number','');
        Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
			}
		});
	};
  }
}


module.exports = self;

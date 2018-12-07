"use strict";

var fs = require('fs');
var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');

//var autoCompleteActions = require('./lib/autocomplete/actions.js');
//var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
//var autoCompleteTriggers = require('./lib/autocomplete/triggers.js');

//var flowActions = require('./lib/flow/actions.js');
//var flowConditions = require('./lib/flow/conditions.js');
//var flowTriggers = require('./lib/flow/triggers.js');
const Log = require('homey-log').Log;
const severity = util.severity;

const Homey = require('homey');
class CountDown extends Homey.App {

  onInit() {
	this.log("CountDown started");
	variableManager.init();

	//autoCompleteActions.createAutocompleteActions();
  //autoCompleteConditions.createAutocompleteConditions();
  //autoCompleteTriggers.createAutocompleteTriggers();

	//flowActions.createActions();
	//flowConditions.createConditions();




	var currentVariables= variableManager.getVariables();
  this.log(currentVariables.length);
  var uniqueUserId = Homey.ManagerSettings.get('uniqueUserId');
  this.log(uniqueUserId);
        if (!util.value_exist(uniqueUserId)) {
            uniqueUserId = util.generateUniqueId();
            Homey.ManagerSettings.set('uniqueUserId', uniqueUserId);
            util.cdLog('Generating new unique user ID: ' + uniqueUserId, severity.debug);
        }
        util.cdLog('Unique user ID: ' + JSON.stringify(uniqueUserId), severity.debug);
        Log.setUser({
          id: uniqueUserId
        });
        Log.setTags({
          timers: currentVariables.length
        })
  //Log.captureMessage("Countdown app started with variables:" + currentVariables.length, { level: 'info'});

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
    var currentVariables= variableManager.getVariables();
		//this.log(currentVariables);
	        currentVariables.forEach(function( obj) {
		 	//this.log(obj.name);
			//this.log(obj.value);
      //this.log(typeof obj.value);
      //this.log('----');
      var tokens = { 'variable' : obj.name, 'value' : obj.value };
      var state = { 'variable' : obj.name };
      if (obj.value == 0) {
				//this.log("Value triggered: ",obj.value);
				// Homey.manager('flow').trigger('countdown_test');
				//var tokens = { 'variable' : obj.name };
				//var state = { 'variable' : obj.name };
				Homey.manager('flow').trigger('countdown_to_zero', tokens, state);
        Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
	  		variableManager.updateVariable(obj.name,-1,'number','');
			}
			if (obj.value > 0) {
				variableManager.updateVariable(obj.name, obj.value - 1, 'number','');
        Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
			}
		});
	};
  }
}


module.exports = CountDown;

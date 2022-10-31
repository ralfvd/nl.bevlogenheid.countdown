"use strict";

//require('inspector').open(9229, '0.0.0.0')

var fs = require('fs');
let variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');

const _ = require('lodash-core');
//var FlowCardTrigger = require('./flow/triggers.js');

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


  async onInit() {
    //if (process.env.DEBUG === '1') require('inspector').open(9231, '0.0.0.0', true);
    this.log(`CountDown ${Homey.manifest.version} started`);
    //console.log(this.homey.settings.get('variables'))
    variableManager.init(this.homey);

    // init variableManager

    // util.cdLog("variable manager started");
    // var variables = variableManager.getVariables();
    // //FlowCardTrigger.CreateFlowCardTriggers(this);
    // //create tokens
    // //var test = this
    // variables.forEach(function (variable) {
    //   //console.log(variable)
    //   console.log(variable.name + ":" + variable.remove)
    //   if (typeof variable.remove === 'undefined') {
    //     console.log("Fixing removal type: " + variable.name + " : " + variable.remove)
    //     variableManager.updateVariable(variable.name, variable.value, variable.type, variable.pause, false)
    //   }
    //   variableManager.createToken(variable.name, variable.value, variable.type, variable.pause);
    // });


    var currentVariables = variableManager.getVariables();
    this.log(currentVariables.length);
    var uniqueUserId = this.homey.settings.get('uniqueUserId');
    this.log(uniqueUserId);
    //this.log(currentVariables);
    if (!util.value_exist(uniqueUserId)) {
      uniqueUserId = util.generateUniqueId();
      this.homey.settings.get('uniqueUserId', uniqueUserId);
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
    this.homey.on('memwarn', function (data) {
      console.log('memory above 100mb')
      console.log('count: ' + data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
      util.cdLog('Memory warning: ' + JSON.stringify(currentVariables), severity.error)

    });

    this.homey.on('cpuwarn', function (data) {
      console.log('cpu above 80%')
      console.log('count: ' + data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
      util.cdLog('CPU warning: ' + JSON.stringify(currentVariables), severity.error)

    });

    //var test = this
    //console.log(test)
    this.homey.setInterval(() => {
      var currentVariables = variableManager.getVariables();
      //console.log('interval');
      //this.log(currentVariables);
      currentVariables.forEach(function (obj) {
        //console.log(obj)
        //this.log(obj.name);
        //this.log(obj.value);
        //this.log(typeof obj.value);
        //this.log('----');
        var tokens = { 'variable': obj.name, 'value': obj.value };
        //console.log(tokens)
        var state = { 'variable': obj.name };
        // sanitize obj.value ( Github issue #40)
        // 5,2 wordt als NaN gezien, dus hij kan daar geen Number van maken.
        // deze oplossing zorgt wel niet voor een nette afronding, dus 5,9 wordt 5
        if (typeof obj.value === 'string') {
          //console.log ('string conversion')
          obj.value = parseInt(obj.value, 10);
        }
        // 5.2 moet afgerond worden
        obj.value = Math.round(obj.value);
        //console.log(obj.value)
        // # github issue #40
        //console.log(obj.name, obj.value, obj.pause)
        if (typeof obj.remove === 'undefined') {
          console.log('fixing remove entry for: ' + obj.name);
          variableManager.updateVariable(obj.name, obj.value, 'number', obj.pause, false);
        }
        if (obj.value == 0 || obj.value < 0) {
          //this.log("Value triggered: ",obj.value);
          // homey.flow.getTriggerCard('countdown_test');
          //var tokens = { 'variable' : obj.name };
          //var state = { 'variable' : obj.name };

          //homey.flow.getTriggerCard('countdown_to_zero', tokens, state);
          //homey.flow.getTriggerCard('countdown_timer_changed', tokens, state);
          variableManager.updateVariable(obj.name, -1, 'number', '0', false);
        }
        if (obj.value > 0 && obj.pause != 1) {
          //console.log(obj.remove)
          //console.log(obj.name, obj.value, obj.pause);
          variableManager.updateVariable(obj.name, obj.value - 1, 'number', '0', false);
          //homey.flow.getTriggerCard('countdown_timer_changed', tokens, state);
        }
      });
    }, 1000); // end interval

  }
}


module.exports = CountDown;

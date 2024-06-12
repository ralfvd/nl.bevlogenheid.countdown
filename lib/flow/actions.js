var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createActions = function (homey) {


    homey.flow.getActionCard('set_countdown_timer').registerRunListener(async (args) => {
          console.log('set countdown timer');
           var setdate = getShortDate();
           if (args.variable && args.variable.name) {
            var variable = variableManager.getvariable(args.variable.name);
            var tokens = { 'variable' : args.variable.name };
            var state = { 'variable' : args.variable.name };
            homey.log(tokens);
            homey.flow.getTriggerCard('countdown_started').trigger( tokens, state);
            if (variable) {
              variableManager.updatevariable(args.variable.name, parseInt(args.value), 'number',setdate);
                return true;
            }
       }
        return false;

});

homey.flow.getActionCard('set_random_countdown_timer').registerRunListener(async (args) => {
       var setdate = getShortDate();
       if (args.variable && args.variable.name) {
        var variable = variableManager.getvariable(args.variable.name);
        if (variable) {
            //the *1 is to make a number of args.valuemin
            var newtimer = Math.floor(Math.random() * (args.valuemax - args.valuemin + 1) + args.valuemin*1);
            variableManager.updatevariable(args.variable.name, newtimer, 'number',setdate);
           return true;
        }
   }
    return false;

});

homey.flow.getActionCard('adjust_countdown_timer').registerRunListener(async (args) => {
      homey.log('adjust countdown timer');
      homey.log(args.value);
       var setdate = getShortDate();
       if (args.variable && args.variable.name) {
        var variable = variableManager.getvariable(args.variable.name);
        var tokens = { 'variable' : args.variable.name };
        var state = { 'variable' : args.variable.name };
        //homey.log(tokens);
        homey.log('args.value ' + args.value);
        homey.log(Number(args.value))
        homey.log('variable.value ' + Number(variable.value))
        var newTimervalue = Number(args.value) + Number(variable.value);
        homey.log('new value: ' + newTimervalue);
        if (newTimervalue < 0 ) { newTimervalue = 0 };
        //homey.flow.getTriggerCard('countdown_started', tokens, state);
        if (variable) {
          variableManager.updatevariable(args.variable.name, newTimervalue, 'number',setdate);
           return true;
        }
   }
    return false;
});

    homey.flow.getActionCard('stop_countdown_timer').registerRunListener(async (args) => {
          homey.log('stop countdown timer');
           var setdate = getShortDate();
           if (args.variable && args.variable.name) {
              var variable = variableManager.getvariable(args.variable.name);
              var tokens = { 'variable' : args.variable.name };
              var state = { 'variable' : args.variable.name };
              homey.flow.getTriggerCard('countdown_stopped').trigger( tokens, state);
              if (variable) {
                variableManager.updatevariable(args.variable.name, -1, 'number',setdate);
                return true;
              }
            }
          return false;
});

homey.flow.getActionCard('stop_all_countdown_timers').registerRunListener(async (args) => {
      homey.log('stop all countdown timers');
      var setdate = getShortDate();
      var currentVariables= variableManager.getvariables();
      //homey.log(currentVariables);
      currentVariables.forEach(function( obj) {
         homey.log(obj.name);
         homey.log(obj.value);
         var tokens = { 'variable' : obj.name, 'value' : obj.value };
         var state = { 'variable' : obj.name };
         homey.flow.getTriggerCard('countdown_stopped').trigger(tokens, state);
           if (obj) {
              variableManager.updatevariable(obj.name, -1, 'number',setdate);
              return true;
              return;
           }
      })
    return false;
});
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function iskBoolean(bool) {
    return typeof bool === 'boolean' ||
          (typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
}

function getShortDate() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

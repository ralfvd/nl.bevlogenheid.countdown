var util = require('../util/util.js');

var FlowCardTrigger = require('../flow/triggers.js');
var newVar = '';
var insights = [];
var tokens = [];

const Homey = require('homey');

module.exports = {
    init: function() {
        util.cdLog("variable manager started")
      	var variables = getVariables();
        FlowCardTrigger.CreateFlowCardTriggers(this);
        //create tokens
        variables.forEach(function(variable) {
            createToken(variable.name, variable.value, variable.type, variable.pause);
        });

        Homey.ManagerSettings.on('set',
                function (action) {
                  if (action == 'deleteall') {
                      //deleteAllInsights();
                      deleteAllTokens();
                      Homey.ManagerSettings.set('variables', []);
                  }
                  if (action == 'changedvariables') {
                    util.cdLog('set variable management')
                    const changeObject = Homey.ManagerSettings.get('changedvariables');
                    const newVariable = changeObject.variable;
                    updateVariable(newVariable.name, newVariable.value, newVariable.type, newVariable.pause, newVariable.remove);

                    util.cdLog('-----Vars Changed----');
                    //util.cdLog(newVariables);
                    util.cdLog('---------------------');
                    util.cdLog('-----Var Changed-----');
                    util.cdLog(newVariable);
                    util.cdLog('---------------------');
                    //var oldVariables = getVariables();
                    //var oldVariable = findVariable(oldVariables, newVariable.name);
                    //processValueChanged(variables, oldVariable, newVariable);
                  }
        });
    },
    getVariables: function() {
        return getVariables();
    },
    getVariable : function(variable) {
        return findVariable(getVariables(), variable);
    },
    updateVariable: function(name, value, type, pause) {
        updateVariable(name, value, type, pause);
    }
}

function updateVariable(name, value, type, pause, remove = false ) {
        //console.log(name, value, type, pause)
        //util.cdLog('START update variable')
        //util.cdLog(name);
        //util.cdLog(value);
        //util.cdLog(remove);
        //util.cdLog(pause)
        //util.cdLog('END update variable END')
        const variables = getVariables();
        const oldVariable = findVariable(variables, name);
        //util.cdLog(oldVariable)
        if (oldVariable) {
          if (pause === '1') {
            //console.log('pause' + name, pause)
            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: remove,
                pause: '1',
                lastChanged: getShortDate()
            }
            variables.unshift(newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);
            Homey.ManagerApi.realtime('setting_changed', newVariable);
            processValueChanged(variables, oldVariable, newVariable);
          }

          if (pause === '0') {
            //console.log('resume' + name, pause)
            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: remove,
                pause: '0',
                lastChanged: getShortDate()
            }
            variables.unshift(newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);
            Homey.ManagerApi.realtime('setting_changed', newVariable);
            processValueChanged(variables, oldVariable, newVariable);
          }
      //      if (!remove) {
      //
      //        variables.unshift(newVariable);
      //        variables.splice(variables.indexOf(oldVariable), 1);
      //        Homey.ManagerApi.realtime('setting_changed', newVariable);
      //        processValueChanged(variables, oldVariable, newVariable);

      //      }

          variables.splice(variables.indexOf(oldVariable), 1);

          if (oldVariable.value === value && !remove) {
                return;
            }
          }
	      //if (setdate == '') {
	      //   var setdate = ol[a-z]Variable.lastChanged;
        //}
        //if (oldVariable) {
        //    if (oldVariable.value === value) {
        //        return;
        //    }
        //    variables.splice(variables.indexOf(oldVariable), 1);
        //} else {
        //    return;
        //}

}

function findVariable(variables, variable) {
  return variables.filter(function (item) {
        return item.name === variable;
    })[0];
}

function processValueChanged(variables, oldVariable, newVariable) {
    //console.log('start pVC')
    //console.log(oldVariable)
    //console.log(newVariable)
    //console.log('stop pVC')
    Homey.ManagerSettings.set('variables', variables);
    //console.log(newVariable)
    if (newVariable && newVariable.remove) {
        //removeInsights(newVariable.name);
        //Homey.ManagerInsights.deleteLog(newVariable.name, function(err, state) {});
        console.log("remove")
        removeToken(newVariable.name);
        return;
    }

    if (newVariable && !oldVariable && newVariable.pause != 0) {
        //createInsights(newVariable.name, newVariable.value, newVariable.type);
        createToken(newVariable.name, newVariable.value, newVariable.type, newVariable.pause);

    }

    if (newVariable && oldVariable && oldVariable.value && newVariable.pause == 1) {
       console.log('Variable ' + newVariable.name + ' paused')
       //removeToken(newVariable.name)
       //createToken(newVariable.name, newVariable.value, 'number', '1');
       //updateToken(newVariable.name, newVariable.value, 'number', '1')
    }
    if (newVariable && oldVariable && oldVariable.value !== newVariable.value) {
        console.log('Variable ' + newVariable.name + ' changed from ' + oldVariable.value + ' to ' + newVariable.value);
        //updateInsights(newVariable.name, newVariable.value);
        updateToken(newVariable.name, newVariable.value);
    }

    //countdown_to_zero
    if (newVariable.value == -1  && oldVariable.value == 0 ){
        getTrigger('countdown_to_zero').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_started
    if (newVariable.value !== -1 && oldVariable.value == -1 ){
        getTrigger('countdown_started').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });

    }
    //countdown_updated
    if ( ((newVariable.value - oldVariable.value) > 2) && oldVariable.value !== -1 && newVariable.value !== -1 ){
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_updated
    if ( ((newVariable.value - oldVariable.value) < -2) && oldVariable.value !== -1 && newVariable.value !== -1 ){
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_timer_changed
    if (newVariable.value !== oldVariable.value && newVariable.value !== -1 ){
        //console.log('variablemanager: counttimer changed')
        getTrigger('countdown_timer_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
      //    Homey.ManagerFlow.getCard('trigger','countdown_timer_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_stopped
    if (newVariable.value == -1 && oldVariable.value !== 0 ){
        getTrigger('countdown_stopped').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }


        //getTrigger('if_variable_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        //getTrigger('debug_any_variable_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        //getTrigger('if_one_of_variable_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
}



function findVariable(variables, variable) {
    return variables.filter(function (item) {
        return item.name === variable;
    })[0];
}

function logExists(variableName) {
    return insights.indexOf(variableName) > -1;
}

function getTrigger(name)
{
  return Homey.ManagerFlow.getCard('trigger', name);//.register();
}

function deleteAllTokens() {
    for (var i = tokens.length - 1; i >= 0; i--) {
        tokens[i].unregister().then(() => {}).catch(err => { console.log(err); });
        tokens.splice(i, 1);
    }
}

function createToken(name, value, type, pause) {
    if (type !== 'trigger') {
        var token = new Homey.FlowToken(name, { type: 'number', title: name, pause: pause });
        console.log("+++++")
        console.log(token)
        console.log(name);
        console.log(type);
        token.register()
            .then(() => {
                tokens.push(token);
                return token.setValue(value);
            })
            .catch(err => {
                console.log("-----")
                console.log(token)
                console.log(name);
                console.log(type);
                console.log(err);
                console.log("-----")
            });
    }
}

function removeToken(name) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            tokens[i].unregister().then(() => {}).catch(err => { console.log(err); });
            tokens.splice(i, 1);
        }
    }
}

function updateToken(name, value, number, pause) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            //console.log(typeof(value));
            tokens[i].setValue(Number(value));
            tokens[i].opts.pause == pause;
        }
    }
}

function getShortDate() {
    return new Date().toISOString();
}

function getVariables() {
    var varCollection = Homey.ManagerSettings.get('variables');
    //console.log('----Get variables----');
    //console.log(varCollection);
    //console.log('---------------------');
    if (!varCollection || varCollection === undefined) {
        return [];
    }
    return varCollection;
}

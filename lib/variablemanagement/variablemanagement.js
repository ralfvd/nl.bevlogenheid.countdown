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
            createToken(variable.name, variable.value, variable.type,);
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
                    updateVariable(newVariable.name, newVariable.value, newVariable.type, newVariable.remove);

                    //Homey.log('-----Vars Changed----');
                    //Homey.log(newVariables);
                    //Homey.log('---------------------');
                    //Homey.log('-----Var Changed-----');
                    //Homey.log(newVariable);
                    //Homey.log('---------------------');
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
    updateVariable: function(name, value, type) {
        updateVariable(name, value, type);
    }
}

function updateVariable(name, value, type, remove = false) {
        //console.log('updateVariable')
        const variables = getVariables();
        const oldVariable = findVariable(variables, name);
        if (oldVariable) {
          if (oldVariable.value === value) {
                return;
            }
            variables.splice(variables.indexOf(oldVariable), 1);
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

        const newVariable = {
            name: name,
            value: value,
            type: type,
            remove: remove,
            lastChanged: getShortDate()
        }

        if (!remove) {
        variables.unshift(newVariable);
        Homey.ManagerApi.realtime('setting_changed', newVariable);
        }
    processValueChanged(variables, oldVariable, newVariable);
}

function findVariable(variables, variable) {
  return variables.filter(function (item) {
        return item.name === variable;
    })[0];
}

function processValueChanged(variables, oldVariable, newVariable) {
    Homey.ManagerSettings.set('variables', variables);

    if (newVariable && newVariable.remove) {
        //removeInsights(newVariable.name);
        //Homey.ManagerInsights.deleteLog(newVariable.name, function(err, state) {});
        removeToken(newVariable.name);
        return;
    }

    if (newVariable && !oldVariable) {
        //createInsights(newVariable.name, newVariable.value, newVariable.type);
        createToken(newVariable.name, newVariable.value, newVariable.type);

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

function createToken(name, value, type) {
    if (type !== 'trigger') {
        var token = new Homey.FlowToken(name, { type: type, title: name });
        token.register()
            .then(() => {
                tokens.push(token);
                return token.setValue(value);
            })
            .catch(err => {
                this.error(err);
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

function updateToken(name, value) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            tokens[i].setValue(value);
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

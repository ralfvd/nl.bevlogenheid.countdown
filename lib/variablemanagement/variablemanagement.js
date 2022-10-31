var util = require('../util/util.js');

const _ = require('lodash-core');
var FlowCardTrigger = require('../flow/triggers.js');
var newVar = '';
var insights = [];
var tokens = [];

const Homey = require('homey');
let homey;
let variableManager = module.exports = {
    init: function (_homeyCD) {
        homey = _homeyCD;
        util.cdLog("variable manager started");
        var variables = getVariables();
        FlowCardTrigger.CreateFlowCardTriggers(homey, this);
        //create tokens
        variables.forEach(function (variable) {
            //console.log(variable)
            console.log(variable.name + ":" + variable.remove);
            if (typeof variable.remove === 'undefined') {
                console.log("Fixing removal type: " + variable.name + " : " + variable.remove);
                updateVariable(variable.name, variable.value, variable.type, variable.pause, false);
            }
            createToken(variable.name, variable.value, variable.type, variable.pause);
        });

        homey.settings.on('set', function (action) {
            //console.log(action)
            if (action == 'deleteall') {
                //deleteAllInsights();
                util.cdLog('delete all started');
                deleteAllTokens();
                homey.settings.set('variables', []);
            }

            if (action == 'changedvariables') {
                util.cdLog('set variable management')
                var changeObject = homey.settings.get('changedvariables');
                //util.cdLog(changeObject)
                var newVariables = changeObject.variables;
                var newVariable = changeObject.variable;
                //console.log('-----Var Changed-----');
                //console.log(newVariable);
                //console.log('---------------------');
                util.cdLog(newVariable);

                var oldVariables = getVariables();
                var oldVariable = findVariable(oldVariables, newVariable.name);

                processValueChanged(newVariables, oldVariable, newVariable);
                //processValueChanged(newVariables, oldVariable, newVariable);

            }
        });
    },
    getVariables: function () {
        return getVariables();
    },
    getVariable: function (variable) {
        return findVariable(getVariables(), variable);
    },
    updateVariable: function (name, value, type, pause, remove, auto) {
        const variables = getVariables();
        const oldVariable = findVariable(variables, name);

        if (remove) {
            console.log('remove: ' + name);
            return;

        }

        // remove entry fix
        if (oldVariable && typeof oldVariable.remove === 'undefined') {
            console.log('start remote entry fix');
            console.log("fix remove: " + name);
            console.log(oldVariable);
            console.log(remove);

            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: false,
                pause: pause,
                lastChanged: getShortDate()
            }
            if(auto!==undefined) newVariable.auto = auto;

            console.log(newVariable)
            variables.unshift(newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);
            homey.api.realtime('setting_changed', newVariable);
            processValueChanged(variables, oldVariable, newVariable);
            console.log('end remote entry fix');

        }

        
        // remove entry fix

        //console.log('start update variable: ' + name, value, type, pause, remove)

        //util.cdLog('START update variable')
        //util.cdLog(name);
        //util.cdLog(value);
        //util.cdLog(remove);
        //util.cdLog(pause)
        //util.cdLog('END update variable END')
        //console.log('old variable remove: ' + oldVariable.remove)
        //console.log(name, pause, oldVariable.pause)
        //console.log('old: ' + oldVariable)

        //if (name === "MotionOverloop")
        //{
        //  console.log('motionoverloop')
        //  return
        //}
        //console.log(oldVariable)

        if (typeof oldVariable === 'undefined') {
            console.log('Add new variable');
            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: remove,
                pause: '0',
                lastChanged: getShortDate()
            };
            if(auto!==undefined) newVariable.auto = auto;
            if (!remove) {
                variables.unshift(newVariable);
                homey.api.realtime('setting_changed', newVariable);
                processValueChanged(variables, oldVariable, newVariable);
                variables.splice(variables.indexOf(oldVariable), 1);
            }
        }

        if (oldVariable && oldVariable.pause === '0' && pause === '1') {
            console.log('pause: ' + name + ' ' + pause)
            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: false,
                pause: '1',
                lastChanged: getShortDate()
            }
            if(auto!==undefined) newVariable.auto = auto;
            variables.unshift(newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);
            homey.api.realtime('setting_changed', newVariable);
            processValueChanged(variables, oldVariable, newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);

        }
        else if (oldVariable && oldVariable.pause === '1' && pause === '0') {
            console.log('resume: ' + name + ' ' + pause)
            const newVariable = {
                name: name,
                value: value,
                type: type,
                remove: false,
                pause: '0',
                lastChanged: getShortDate()
            }
            if(auto!==undefined) newVariable.auto = auto;
            variables.unshift(newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);
            homey.api.realtime('setting_changed', newVariable);
            processValueChanged(variables, oldVariable, newVariable);
            variables.splice(variables.indexOf(oldVariable), 1);

        }

        // if value didn't change, immediately exit routine
        else if (oldVariable && oldVariable.value === value && !remove) {
            //console.log('return ' + name)
            return;
        }

        else if (oldVariable && oldVariable.value !== value) {
            //console.log(name, pause)
            if (pause === '0' && !remove) {
                //console.log ('update variable: ' + name, value)
                const newVariable = {
                    name: name,
                    value: value,
                    type: type,
                    remove: false,
                    pause: '0',
                    lastChanged: getShortDate()
                }
                if(auto!==undefined) newVariable.auto = auto;
                variables.unshift(newVariable);
                variables.splice(variables.indexOf(oldVariable), 1);
                homey.api.realtime('setting_changed', newVariable);
                processValueChanged(variables, oldVariable, newVariable);
                variables.splice(variables.indexOf(oldVariable), 1);

            }
        }

        //      const newVariable = {
        //          name: name,
        //          value: value,
        //          type: type,
        //          remove: remove,
        //          pause: '0',
        //          lastChanged: getShortDate()
        //      }
        //      if (!remove) {
        //        variables.unshift(newVariable);
        //        homey.api.realtime('setting_changed', newVariable);
        //      }
        //      processValueChanged(variables, oldVariable, newVariable);
        //  }

        //      if (!remove) {
        //
        //        variables.unshift(newVariable);
        //        variables.splice(variables.indexOf(oldVariable), 1);
        //        homey.api.realtime('setting_changed', newVariable);
        //        processValueChanged(variables, oldVariable, newVariable);

        //      }

    },
    addVariable: function(name) {
        return variableManager.updateVariable(name, -1, "number", "0", false, true);
    },
    removeVariable: function(name) {
        console.log('removingVariable: ' + name);
        const variables = getVariables();
        
        let variable = _.find(variables, x=> x.name===name);//this.getVariable(name);
        if(!variable) return;
        
        variables.splice(variables.indexOf(variable), 1);
        processValueChanged(variables);
        homey.api.realtime('setting_changed', variable);
        removeToken(name);
        return true;
        //return variableManager.updateVariable(name, -1, "number", "0", true, undefined);
    }
};


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
    homey.settings.set('variables', variables);
    //console.log(newVariable)
    if (newVariable && newVariable.remove) {
        //removeInsights(newVariable.name);
        //homey.insights.deleteLog(newVariable.name, function(err, state) {});
        console.log("processValueChanged: remove: " + newVariable.name);
        removeToken(newVariable.name);
        return;
    }

    if (newVariable && !oldVariable && newVariable.pause == 0 && !newVariable.remove) {
        //createInsights(newVariable.name, newVariable.value, newVariable.type);
        createToken(newVariable.name, newVariable.value, newVariable.type, newVariable.pause);

    }

    if (newVariable && oldVariable && oldVariable.value && newVariable.pause == 1) {
        console.log('Variable ' + newVariable.name + ' paused');
        //getTrigger('timer_paused').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        //removeToken(newVariable.name)
        //createToken(newVariable.name, newVariable.value, 'number', '1');
        //updateToken(newVariable.name, newVariable.value, 'number', '1')
    }
    if (newVariable && oldVariable && oldVariable.value !== newVariable.value) {

        // tijdelijk eruit om debug kleiner te maken
        //console.log('Variable ' + newVariable.name + ' changed from ' + oldVariable.value + ' to ' + newVariable.value);
        //

        //updateInsights(newVariable.name, newVariable.value);
        updateToken(newVariable.name, newVariable.value);
    }

    //countdown_to_zero
    if (newVariable && oldVariable && newVariable.value == -1 && oldVariable.value == 0) {
        getTrigger('countdown_to_zero').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_started
    if (newVariable && oldVariable && newVariable.value !== -1 && oldVariable.value == -1) {
        getTrigger('countdown_started').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });

    }
    //countdown_updated
    if (newVariable && oldVariable && ((newVariable.value - oldVariable.value) > 2) && oldVariable.value !== -1 && newVariable.value !== -1) {
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_updated
    if (newVariable && oldVariable && ((newVariable.value - oldVariable.value) < -2) && oldVariable.value !== -1 && newVariable.value !== -1) {
        getTrigger('countdown_started_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        getTrigger('countdown_updated').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_timer_changed
    if (newVariable && oldVariable && newVariable.value !== oldVariable.value && newVariable.value !== -1) {
        //console.log('variablemanager: counttimer changed')
        getTrigger('countdown_timer_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
        //   homey.flow.getTriggerCard('countdown_timer_changed').trigger(null, { "variable": newVariable.name, "value": newVariable.value });
    }

    //countdown_stopped
    if (newVariable && oldVariable && newVariable.value == -1 && oldVariable.value !== 0 && oldVariable.value !== -1) {
        //console.log (newVariable)
        //console.log (newVariable.value)
        //console.log (oldVariable.value)
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

function getTrigger(name) {
    return homey.flow.getTriggerCard(name);//;
}

function deleteAllTokens() {
    console.log(tokens.length);
    for (var i = tokens.length - 1; i >= 0; i--) {
        tokens[i].unregister().then(() => { }).catch(err => { console.log(err); });
        tokens.splice(i, 1);
    }
}

async function createToken(name, value, type, pause) {
    if (type !== 'trigger') {
        var token = await homey.flow.createToken(name, { type: 'number', title: name, pause: pause });
        tokens.push(token);
        //console.log("+++++")
        //console.log(token)
        //console.log(name);
        //console.log(type);
        
        return await token.setValue(value);
    }
}

function removeToken(name) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            console.log('removetoken');
            tokens[i].unregister().then(() => { }).catch(err => { console.log(err); });
            tokens.splice(i, 1);
        }
    }
}

function updateToken(name, value, number, pause) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            //console.log(typeof(value));
            tokens[i].setValue(Number(value));
            tokens[i].opts.pause = pause;
        }
    }
}

function getShortDate() {
    return new Date().toISOString();
}

function getVariables() {
    var varCollection = homey.settings.get('variables');
    //console.log('----Get variables----');
    //console.log(varCollection);
    //console.log('---------------------');
    if (!varCollection || varCollection === undefined) {
        return [];
    }
    return varCollection;
}

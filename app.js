"use strict";

//require('inspector').open(9229, '0.0.0.0')

var fs = require('fs');
//var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');
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

    //// TRIGGERS /////

    //countdown_to_zero
    const countdown_to_zero = this.homey.flow.getTriggerCard('countdown_to_zero');
    countdown_to_zero
      .registerRunListener((args, state) => {
        //console.log('countdown_to_zero ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        if (args.variable.name === state.variable) {
          console.log('flow: countdown_to_zero: ' + args.variable.name)
        }
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        })
      })
      //  .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //countdown_started_updated
    const countdown_started_updated = this.homey.flow.getTriggerCard('countdown_started_updated');
    countdown_started_updated
      .registerRunListener((args, state) => {
        console.log('flow: countdown_started_updated: ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        });
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //countdown__updated
    const countdown_updated = this.homey.flow.getTriggerCard('countdown_updated');
    countdown_updated
      .registerRunListener((args, state) => {
        console.log('flow: countdown_updated ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        });
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //countdown_started
    const countdown_started = this.homey.flow.getTriggerCard('countdown_started');
    countdown_started
      .registerRunListener((args, state) => {
        console.log('flow: countdown_started ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        });
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //countdown_stopped
    const countdown_stopped = this.homey.flow.getTriggerCard('countdown_stopped');
    countdown_stopped
      .registerRunListener((args, state) => {
        console.log('flow: countdown_stopped ' + args.variable.name)
        //console.log(args);  // this is the user input
        // console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        });
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //countdown_timer_changed
    const countdown_timer_changed = this.homey.flow.getTriggerCard('countdown_timer_changed');
    countdown_timer_changed
      .registerRunListener((args, state) => {
        console.log('flow: countdown_timer_changed ' + args.variable.name)

        //console.log(args);  // this is the user input
        //  console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args.variable.name === state.variable).catch(() => {
          console.error('Do that');;
        });
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });



    ///// CONDITIONS ////

    //timer_running
    const timer_running = this.homey.flow.getConditionCard('timer_running');
    timer_running
      .registerRunListener((args, state) => {
        console.log('flow: timer_running ' + args.variable.name)
        //console.log(args.variable);  // this is the user input
        var result = variableManager.getVariable(args.variable.name);
        //console.log(result)
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        if (result) {
          return Promise.resolve(args && result.value == -1).catch(() => {
            console.error('Do that');;
          })
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //timer_matches_number
    const timer_matches_number = this.homey.flow.getConditionCard('timer_matches_number');
    timer_matches_number
      .registerRunListener((args, state) => {
        console.log('flow: timer_matches_number' + args.variable.name)
        //console.log(args.variable);  // this is the user input
        //console.log(args.value)
        var result = variableManager.getVariable(args.variable.name);
        //console.log(result)
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        if (result) {
          return Promise.resolve(args && result.value == args.value).catch(() => {
            console.error('Do that');
          })

        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //timer_less_than_number
    const timer_less_than_number = this.homey.flow.getConditionCard('timer_less_than_number');
    timer_less_than_number
      .registerRunListener((args, state) => {
        console.log('flow: timer_less_than_number ' + args.variable.name)
        //console.log(args.variable);  // this is the user input
        //console.log(state)
        var result = variableManager.getVariable(args.variable.name);
        //console.log(result)
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        if (result) {
          return Promise.resolve(args && result.value < args.value).catch(() => {
            console.error('Do that');;
          })
        }

      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //timer_greater_than_number
    const timer_greater_than_number = this.homey.flow.getConditionCard('timer_greater_than_number');
    timer_greater_than_number
      .registerRunListener((args, state) => {
        console.log('flow: timer_greater_than_number ' + args.variable.name)
        //console.log(args.variable);  // this is the user input
        //console.log(state)
        var result = variableManager.getVariable(args.variable.name);
        //console.log(result)
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve(args && result.value > args.value).catch(() => {
          console.error('Do that');;
        })
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //timer_paused
    const timer_paused = this.homey.flow.getConditionCard('timer_paused');
    timer_paused
      .registerRunListener((args, state) => {
        console.log('flow: timer_paused ' + args.variable.name)
        //console.log(args.variable);  // this is the user input
        var result = variableManager.getVariable(args.variable.name);
        //console.log(result)
        //console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        if (result) {
          return Promise.resolve(args && result.pause == 1).catch(() => {
            console.error('Do that');;
          })
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //// ACTIONS ////

    //set_countdown_timer
    const set_countdown_timer = this.homey.flow.getActionCard('set_countdown_timer');
    set_countdown_timer
      .registerRunListener((args, state) => {
        if (typeof args.variable.name !== 'undefined') {
          console.log('flow: set_countdown_timer ' + args.variable.name + ' ' + args.value)
        }
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        // If true, this flow should run
        if (args.variable && args.variable.name) {
          var result = variableManager.getVariable(args.variable.name);
          if (result) {
            return Promise.resolve(updateVariable(args.variable.name, args.value, 'number', '0')).catch(() => {
              console.error('Do that');;
            });
          }
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //set_random_countdown_timer
    const set_random_countdown_timer = this.homey.flow.getActionCard('set_random_countdown_timer');
    set_random_countdown_timer
      .registerRunListener((args, state) => {
        console.log('flow: set_random_countdown_timer ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        //   If true, this flow should run
        if (args.variable && args.variable.name) {
          var result = variableManager.getVariable(args.variable.name);
          var newtimer = Math.floor(Math.random() * (args.valuemax - args.valuemin + 1) + args.valuemin * 1);
          if (result) {
            return Promise.resolve(updateVariable(args.variable.name, newtimer, 'number', '0')).catch(() => {
              console.error('Do that');;
            });
          }
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //adjust_countdown_timer
    const adjust_countdown_timer = this.homey.flow.getActionCard('adjust_countdown_timer');
    adjust_countdown_timer
      .registerRunListener((args, state) => {
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        //   If true, this flow should run
        if (args.variable && args.variable.name) {
          console.log('flow: adjust_countdown_timer ' + args.variable.name)

          //var result = variableManager.getVariable(args.variable.name);
          //if (result) {
          return Promise.resolve(updateVariable(args.variable.name, args.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
          //}
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });


    //stop_countdown_timer
    const stop_countdown_timer = this.homey.flow.getActionCard('stop_countdown_timer');
    stop_countdown_timer
      .registerRunListener((args, state) => {
        console.log('flow: stop_countdown_timer ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        //   If true, this flow should run
        if (args.variable && args.variable.name) {
          var result = variableManager.getVariable(args.variable.name);
          if (result) {
            return Promise.resolve(updateVariable(args.variable.name, -1, 'number', '0')).catch(() => {
              console.error('Do that');;
            });
          }
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //pause_countdown_timer
    const pause_countdown_timer = this.homey.flow.getActionCard('pause_countdown_timer');
    pause_countdown_timer
      .registerRunListener((args, state) => {
        console.log('flow: pause_countdown_timer ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        //   If true, this flow should run
        if (args.variable && args.variable.name) {
          var result = variableManager.getVariable(args.variable.name);
          if (result) {
            return Promise.resolve(updateVariable(args.variable.name, result.value, 'number', '1')).catch(() => {
              console.error('Do that');;
            });
          }
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //resume_countdown_timer
    const resume_countdown_timer = this.homey.flow.getActionCard('resume_countdown_timer');
    resume_countdown_timer
      .registerRunListener((args, state) => {
        console.log('flow: resume_countdown_timer ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        //   If true, this flow should run
        if (args.variable && args.variable.name) {
          var result = variableManager.getVariable(args.variable.name);
          if (result) {
            console.log('resume started')
            return Promise.resolve(updateVariable(args.variable.name, result.value, 'number', '0')).catch(() => {
              console.error('Do that');;
            });
          }
        }
      })
      // .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

    //stop_all_countdown_timers
    const stop_all_countdown_timers = this.homey.flow.getActionCard('stop_all_countdown_timers');
    stop_all_countdown_timers
      //.getArgument('variable')
      .registerRunListener((args, state) => {
        console.log('flow: stop_all_countdown_timers')
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        var currentVariables = getVariables();
        console.log(currentVariables);
        return Promise.resolve(
          currentVariables.forEach(function (obj) {
            updateVariable(obj.name, -1, 'number', '0')
          })
        ).catch(() => {
          console.error('Do that');;
        })
      })
    // .register()

    // End triggers, conditions, actions

    // Start "program"

    this.log("CountDown 3.0.0 started");
    //console.log(this.homey.settings.get('variables'))
    //	variableManager.init(this.homey);

    // init variableManager

    util.cdLog("variable manager started")
    var variables = this.getVariables();
    //FlowCardTrigger.CreateFlowCardTriggers(this);
    //create tokens
    var test = this
    variables.forEach(function (variable) {
      //console.log(variable)
      console.log(variable.name + ":" + variable.remove)
      if (typeof variable.remove === 'undefined') {
        console.log("Fixing removal type: " + variable.name + " : " + variable.remove)
        test.updateVariable(variable.name, variable.value, variable.type, variable.pause, false)
      }
      test.createToken(variable.name, variable.value, variable.type, variable.pause);
    })


    var test = this
    this.homey.settings.on('set', function (action) {
      //console.log(action)
      if (action == 'deleteall') {
        //deleteAllInsights();
        util.cdLog('delete all started')
        this.deleteAllTokens();
        this.homey.settings.set('variables', []);
      }

      if (action == 'changedvariables') {
        util.cdLog('set variable management')
        var changeObject = this.homey.settings.get('changedvariables');
        console.log(changeObject)
        //util.cdLog(changeObject)
        var newVariables = changeObject.variables;
        var newVariable = changeObject.variable;
        //console.log('-----Var Changed-----');
        //console.log(newVariable);
        //console.log('---------------------');
        //util.cdLog(newVariable);

        // error dat hij this.getVariables niet kan vinden als functie, geldt ook voor de andere this.statements in dit stuk
        // zonder 'this' werkt het ook niet, dus wat is het dan?

        var oldVariables = test.getVariables();
        var oldVariable = test.findVariable(oldVariables, newVariable.name);
        test.processValueChanged(newVariables, oldVariable, newVariable);
        //processValueChanged(newVariables, oldVariable, newVariable);

      }
    })
    // end INIT

    var currentVariables = this.getVariables();
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
    var test = this
    //console.log(test)
    this.homey.setInterval(() => {
      var currentVariables = this.getVariables()
      console.log('interval')
      //this.log(currentVariables);
      currentVariables.forEach(function (obj) {
        //console.log(obj)
        //this.log(obj.name);
        //this.log(obj.value);
        //this.log(typeof obj.value);
        //this.log('----');
        var tokens = { 'variable': obj.name, 'value': obj.value };
        console.log(tokens)
        var state = { 'variable': obj.name };
        // sanitize obj.value ( Github issue #40)
        // 5,2 wordt als NaN gezien, dus hij kan daar geen Number van maken.
        // deze oplossing zorgt wel niet voor een nette afronding, dus 5,9 wordt 5
        if (typeof obj.value === 'string') {
          //console.log ('string conversion')
          obj.value = parseInt(obj.value, 10)
        }
        // 5.2 moet afgerond worden
        obj.value = Math.round(obj.value)
        //console.log(obj.value)
        // # github issue #40
        //console.log(obj.name, obj.value, obj.pause)
        if (typeof obj.remove === 'undefined') {
          console.log('fixing remove entry for: ' + obj.name)
          test.updateVariable(obj.name, obj.value, 'number', obj.pause, false);
        }
        if (obj.value == 0 || obj.value < 0) {
          //this.log("Value triggered: ",obj.value);
          // Homey.manager('flow').trigger('countdown_test');
          //var tokens = { 'variable' : obj.name };
          //var state = { 'variable' : obj.name };

          //Homey.manager('flow').trigger('countdown_to_zero', tokens, state);
          //Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
          test.updateVariable(obj.name, -1, 'number', '0', false);
        }
        if (obj.value > 0 && obj.pause != 1) {
          //console.log(obj.remove)
          //console.log(obj.name, obj.value, obj.pause);
          test.updateVariable(obj.name, obj.value - 1, 'number', '0', false);
          //Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
        }
      });
    }, 1000) // end interval

  }
}


module.exports = CountDown;

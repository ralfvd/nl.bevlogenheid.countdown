"use strict";

const Homey = require('homey');
var Utilities = require('../util/utilities.js');

var math = require('../util/math.js');
var util = require('../util/util.js');

module.exports = {

  CreateFlowCardTriggers: function (variableManager) {
        if (variableManager === undefined) {
            return;
        }
  this.variableManager = variableManager;

//// TRIGGERS /////

  //countdown_to_zero
  let countdown_to_zero = new Homey.FlowCardTrigger('countdown_to_zero');
    countdown_to_zero
    .registerRunListener((args, state) => {
        console.log('countdown_to_zero')
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        // If true, this flow should run
        return Promise.resolve( args.variable.name === state.variable );
    })
    .register()
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
    });

    //countdown_started
    let countdown_started = new Homey.FlowCardTrigger('countdown_started');
      countdown_started
      .registerRunListener((args, state) => {
          console.log('countdown_started')
          //console.log(args);  // this is the user input
          //console.log(state);  // this is the state parameter, as passed in trigger()
          // If true, this flow should run
          return Promise.resolve( args.variable.name === state.variable );
      })
      .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
      });

  //countdown_stopped
 let countdown_stopped = new Homey.FlowCardTrigger('countdown_stopped');
   countdown_stopped
   .registerRunListener((args, state) => {
      console.log('countdown_stopped')
      //console.log(args);  // this is the user input
      // console.log(state);  // this is the state parameter, as passed in trigger()

       // If true, this flow should run
       return Promise.resolve( args.variable.name === state.variable );
   })
   .register()
   .getArgument('variable')
   .registerAutocompleteListener((query, args) => {
     return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
   });

   //countdown_timer_changed
  let countdown_timer_changed = new Homey.FlowCardTrigger('countdown_timer_changed');
    countdown_timer_changed
    .registerRunListener((args, state) => {
       //console.log('countdown_timer_changed')
       //console.log(args);  // this is the user input
      //  console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve( args.variable.name === state.variable );
    })
    .register()
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
    });



///// CONDITIONS ////

  //timer_running
  let timer_running = new Homey.FlowCardCondition('timer_running');
  timer_running
  .registerRunListener((args, state) => {
    console.log('timer_running')
    //console.log(args.variable);  // this is the user input
    var result = variableManager.getVariable(args.variable.name);
    //console.log(result)
    //console.log(state);  // this is the state parameter, as passed in trigger()
    // If true, this flow should run
    return Promise.resolve(args && result.value == -1)
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //timer_matches_number
  let timer_matches_number = new Homey.FlowCardCondition('timer_matches_number');
  timer_matches_number
  .registerRunListener((args, state) => {
    console.log('timer_matches_number' + args.variable.name)
    //console.log(args.variable);  // this is the user input
    //console.log(args.value)
    var result = variableManager.getVariable(args.variable.name);
    //console.log(result)
    //console.log(state);  // this is the state parameter, as passed in trigger()
    // If true, this flow should run
    if (result) {
      return Promise.resolve(args && result.value == args.value)
    }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //timer_less_than_number
  let timer_less_than_number = new Homey.FlowCardCondition('timer_less_than_number');
  timer_less_than_number
  .registerRunListener((args, state) => {
    console.log('timer_less_than_number')
    //console.log(args.variable);  // this is the user input
    //console.log(state)
    var result = variableManager.getVariable(args.variable.name);
    //console.log(result)
    //console.log(state);  // this is the state parameter, as passed in trigger()
    // If true, this flow should run
    return Promise.resolve(args && result.value < args.value)
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //timer_greater_than_number
  let timer_greater_than_number = new Homey.FlowCardCondition('timer_greater_than_number');
  timer_greater_than_number
  .registerRunListener((args, state) => {
    console.log('timer_greater_than_number')
    //console.log(args.variable);  // this is the user input
    //console.log(state)
    var result = variableManager.getVariable(args.variable.name);
    //console.log(result)
    //console.log(state);  // this is the state parameter, as passed in trigger()
    // If true, this flow should run
    return Promise.resolve(args && result.value > args.value)
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });
//// ACTIONS ////

  //set_countdown_timer
  let set_countdown_timer = new Homey.FlowCardAction('set_countdown_timer');
  set_countdown_timer
  .registerRunListener((args, state) => {
    console.log('set_countdown_timer')
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    // If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number'));
        }
    }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //set_random_countdown_timer
  let set_random_countdown_timer = new Homey.FlowCardAction('set_random_countdown_timer');
  set_random_countdown_timer
  .registerRunListener((args, state) => {
    console.log('set_random_countdown_timer')
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        var newtimer = Math.floor(Math.random() * (args.valuemax - args.valuemin + 1) + args.valuemin*1);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, newtimer, 'number'));
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //adjust_countdown_timer
  let adjust_countdown_timer = new Homey.FlowCardAction('adjust_countdown_timer');
  adjust_countdown_timer
  .registerRunListener((args, state) => {
    //console.log('adjust_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
      console.log('adjust_countdown_timer ' + args.variable.name)

        //var result = variableManager.getVariable(args.variable.name);
        //if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number'));
        //}
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });


  //stop_countdown_timer
  let stop_countdown_timer = new Homey.FlowCardAction('stop_countdown_timer');
  stop_countdown_timer
  .registerRunListener((args, state) => {
    console.log('stop_countdown_timer')
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, -1, 'number'));
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
  });

  //stop_all_countdown_timers
  let stop_all_countdown_timers = new Homey.FlowCardAction('stop_all_countdown_timers');
  stop_all_countdown_timers
  .registerRunListener((args, state) => {
    console.log('stop_all_countdown_timers')
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()
    var currentVariables= variableManager.getVariables();
    console.log(currentVariables);
    return Promise.resolve(
  	        currentVariables.forEach(function( obj) {
                variableManager.updateVariable(obj.name, -1, 'number')
            })
      )
  })
  .register()
  .getArgument('variable')
//  .registerAutocompleteListener((query, args) => {
//    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
//  });
} // CreateFlowCardTriggers

}

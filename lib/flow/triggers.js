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
        console.log('countdown_to_zero ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()

        // If true, this flow should run
        return Promise.resolve( args.variable.name === state.variable ).catch(() => {
          console.error('Do that');;
        })
      })
    .register()
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
        console.error('Do that');;
      });
    });

    //countdown_started_updated
    let countdown_started_updated = new Homey.FlowCardTrigger('countdown_started_updated');
      countdown_started_updated
      .registerRunListener((args, state) => {
          console.log('countdown_started_updated ' + args.variable.name)
          //console.log(args);  // this is the user input
          //console.log(state);  // this is the state parameter, as passed in trigger()
          // If true, this flow should run
          return Promise.resolve( args.variable.name === state.variable ).catch(() => {
            console.error('Do that');;
          });
      })
      .register()
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
          console.error('Do that');;
        });
      });

      //countdown__updated
      let countdown_updated = new Homey.FlowCardTrigger('countdown_updated');
        countdown_updated
        .registerRunListener((args, state) => {
            console.log('flow: countdown_updated ' + args.variable.name)
            //console.log(args);  // this is the user input
            //console.log(state);  // this is the state parameter, as passed in trigger()
            // If true, this flow should run
            return Promise.resolve( args.variable.name === state.variable ).catch(() => {
              console.error('Do that');;
            });
        })
        .register()
        .getArgument('variable')
        .registerAutocompleteListener((query, args) => {
          return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
            console.error('Do that');;
          });
        });

      //countdown_started
      let countdown_started = new Homey.FlowCardTrigger('countdown_started');
        countdown_started
        .registerRunListener((args, state) => {
            console.log('flow: countdown_started ' + args.variable.name)
            //console.log(args);  // this is the user input
            //console.log(state);  // this is the state parameter, as passed in trigger()
            // If true, this flow should run
            return Promise.resolve( args.variable.name === state.variable ).catch(() => {
              console.error('Do that');;
            });
        })
        .register()
        .getArgument('variable')
        .registerAutocompleteListener((query, args) => {
          return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
            console.error('Do that');;
          });
        });

  //countdown_stopped
 let countdown_stopped = new Homey.FlowCardTrigger('countdown_stopped');
   countdown_stopped
   .registerRunListener((args, state) => {
      console.log('flow: countdown_stopped ' + args.variable.name)
      //console.log(args);  // this is the user input
      // console.log(state);  // this is the state parameter, as passed in trigger()

       // If true, this flow should run
       return Promise.resolve( args.variable.name === state.variable ).catch(() => {
         console.error('Do that');;
       });
   })
   .register()
   .getArgument('variable')
   .registerAutocompleteListener((query, args) => {
     return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
       console.error('Do that');;
     });
   });

   //countdown_timer_changed
  let countdown_timer_changed = new Homey.FlowCardTrigger('countdown_timer_changed');
    countdown_timer_changed
    .registerRunListener((args, state) => {
       console.log('flow: countdown_timer_changed ' + args.variable.name)

       //console.log(args);  // this is the user input
      //  console.log(state);  // this is the state parameter, as passed in trigger()
        // If true, this flow should run
        return Promise.resolve( args.variable.name === state.variable ).catch(() => {
          console.error('Do that');;
        });
    })
    .register()
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
        console.error('Do that');;
      });
    });



///// CONDITIONS ////

  //timer_running
  let timer_running = new Homey.FlowCardCondition('timer_running');
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
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_matches_number
  let timer_matches_number = new Homey.FlowCardCondition('timer_matches_number');
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
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_less_than_number
  let timer_less_than_number = new Homey.FlowCardCondition('timer_less_than_number');
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
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_greater_than_number
  let timer_greater_than_number = new Homey.FlowCardCondition('timer_greater_than_number');
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
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });
//// ACTIONS ////

  //set_countdown_timer
  let set_countdown_timer = new Homey.FlowCardAction('set_countdown_timer');
  set_countdown_timer
  .registerRunListener((args, state) => {
    if (typeof args.variable.name !== 'undefined') {
    console.log('flow: set_countdown_timer ' + args.variable.name)
    }
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    // If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
    }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //set_random_countdown_timer
  let set_random_countdown_timer = new Homey.FlowCardAction('set_random_countdown_timer');
  set_random_countdown_timer
  .registerRunListener((args, state) => {
    console.log('flow: set_random_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        var newtimer = Math.floor(Math.random() * (args.valuemax - args.valuemin + 1) + args.valuemin*1);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, newtimer, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //adjust_countdown_timer
  let adjust_countdown_timer = new Homey.FlowCardAction('adjust_countdown_timer');
  adjust_countdown_timer
  .registerRunListener((args, state) => {
    console.log('flow: adjust_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
      console.log('flow: adjust_countdown_timer ' + args.variable.name)

        //var result = variableManager.getVariable(args.variable.name);
        //if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        //}
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });


  //stop_countdown_timer
  let stop_countdown_timer = new Homey.FlowCardAction('stop_countdown_timer');
  stop_countdown_timer
  .registerRunListener((args, state) => {
    console.log('flow: stop_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, -1, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //pause_countdown_timer
  let pause_countdown_timer = new Homey.FlowCardAction('pause_countdown_timer');
  pause_countdown_timer
  .registerRunListener((args, state) => {
    console.log('flow: pause_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, result.value, 'number', '1')).catch(() => {
            console.error('Do that');;
          });
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //resume_countdown_timer
  let resume_countdown_timer = new Homey.FlowCardAction('resume_countdown_timer');
  resume_countdown_timer
  .registerRunListener((args, state) => {
    console.log('flow: resume_countdown_timer ' + args.variable.name)
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
        var result = variableManager.getVariable(args.variable.name);
        if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, result.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
      }
  })
  .register()
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(variableManager.getVariables().filter(util.contains(query))).catch(() => {
      console.error('Do that');;
    });
  });

  //stop_all_countdown_timers
  let stop_all_countdown_timers = new Homey.FlowCardAction('stop_all_countdown_timers');
  stop_all_countdown_timers
  .registerRunListener((args, state) => {
    console.log('flow: stop_all_countdown_timers')
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()
    var currentVariables= variableManager.getVariables();
    console.log(currentVariables);
    return Promise.resolve(
  	        currentVariables.forEach(function( obj) {
                variableManager.updateVariable(obj.name, -1, 'number', '0')
            })
      ).catch(() => {
        console.error('Do that');;
      })
  })
  .register()
  .getArgument('variable')
//  .registerAutocompleteListener((query, args) => {
//    return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
//  });
} // CreateFlowCardTriggers

}

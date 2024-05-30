"use strict";

const Homey = require('homey');
var Utilities = require('../util/utilities.js');

var math = require('../util/math.js');
var util = require('../util/util.js');
const _ = require('lodash-core');

let homey;
let lastQuery;
module.exports = {

  CreateFlowCardTriggers: function (_homey, variableManager) {
    this.homey = _homey;
    homey = _homey;
        if (variableManager === undefined) {
            return;
        }
    this.variableManager = variableManager;
    this.cards = {};

    this.initArgumentReader = async function() {
      for (const flowTypeId in this.homey.manifest.flow) {
        if (Object.hasOwnProperty.call(this.homey.manifest.flow, flowTypeId)) {
          const flowType = this.homey.manifest.flow[flowTypeId];
          
          let type = flowTypeId=='actions' ? 'Action' : flowTypeId=='conditions' ? 'Condition' : 'Trigger';
          for (const flowcard of flowType) {
            if(flowcard.args && flowcard.args.find(x=>x.name==='variable' && x.type==='autocomplete')) {
              if(!this.cards[flowcard.id]) {
                this.cards[flowcard.id] = {card:await this.homey.flow['get'+type+'Card'](flowcard.id), names:[], id:flowcard.id };
              }
              await this.setArgumentNames(this.cards[flowcard.id]);
              this.cards[flowcard.id].card.on('update', async ()=> { 
                await this.setArgumentNames(this.cards[flowcard.id]); 
                await this.setVariablesFromArguments();
              });
            }
          }
        }
      }      
      await this.setVariablesFromArguments();
    };

    let retrieveCountdowns = (query, args) => {
      let allVariables =variableManager.getVariables();
      let l = allVariables.filter(util.contains(query));
      let added = false;
      if(query && query.length && !allVariables.find(x=>x.name.toLowerCase()===(''||query).toLowerCase())) {
        l.unshift({name:query, type:'number', description:'Create new countdown'});
        added = true;
      } //else lastQuery = null;

      if(lastQuery && lastQuery.length && !query.startsWith(lastQuery) && !l.find(x=>x.name.toLowerCase()===(''||lastQuery).toLowerCase()) && !allVariables.find(x=>x.name.toLowerCase()===(''||lastQuery).toLowerCase())) {
        let a = {name:lastQuery, type:'number', description:'Just added'};
        if(added) l.splice(1,0,a);
        else l.unshift(a);
      }
      if(query && query.length) lastQuery = query;
      
      return l;
    };

    this.setArgumentNames = async (card) => {
      let args = await card.card.getArgumentValues();
      card.names = _.uniq(args.map(x=>x.variable.name));
      console.log(args);      
    };

    this.setVariablesFromArguments = async ()=> {
      let allNames = _.uniq(_.flatMap(this.cards, x=> x.names));
      let variables = variableManager.getVariables();
      for (const name of allNames) {
        if(!_.find(variables, v=>v.name===name)) {
          variableManager.addVariable(name);
          variables = variableManager.getVariables();
        }
      }
      for (const variable of variables) {        
        if(!_.find(allNames, v=>v===variable.name)) {
          let vari = variableManager.getVariable(variable.name);
          if(vari && vari.auto===true) {
            variableManager.removeVariable(variable.name);
            variables = variableManager.getVariables();
          }
        }
      }
    };



    this.initArgumentReader();

  //// TRIGGERS /////

  //countdown_to_zero
  let countdown_to_zero = homey.flow.getTriggerCard('countdown_to_zero');
    countdown_to_zero
    .registerRunListener((args, state) => {
        //console.log('countdown_to_zero ' + args.variable.name)
        //console.log(args);  // this is the user input
        //console.log(state);  // this is the state parameter, as passed in trigger()
        if (args.variable.name === state.variable) {
          console.log('flow: countdown_to_zero: ' + args.variable.name)
        }
        // If true, this flow should run
        return Promise.resolve( args.variable.name === state.variable ).catch(() => {
          console.error('Do that');
        })
      })
    
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
        console.error('Do that');
      });
    });

    //countdown_started_updated
    let countdown_started_updated = homey.flow.getTriggerCard('countdown_started_updated');
      countdown_started_updated
      .registerRunListener((args, state) => {
          console.log('flow: countdown_started_updated: ' + args.variable.name)
          //console.log(args);  // this is the user input
          //console.log(state);  // this is the state parameter, as passed in trigger()
          // If true, this flow should run
          return Promise.resolve( args.variable.name === state.variable ).catch(() => {
            console.error('Do that');;
          });
      })
      
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
        return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
          console.error('Do that');;
        });
      });

      //countdown__updated
      let countdown_updated = homey.flow.getTriggerCard('countdown_updated');
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
        
        .getArgument('variable')
        .registerAutocompleteListener((query, args) => {
          return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
            console.error('Do that');;
          });
        });

      //countdown_started
      let countdown_started = homey.flow.getTriggerCard('countdown_started');
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
        
        .getArgument('variable')
        .registerAutocompleteListener((query, args) => {
          return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
            console.error('Do that');;
          });
        });

  //countdown_stopped
 let countdown_stopped = homey.flow.getTriggerCard('countdown_stopped');
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
   
   .getArgument('variable')
   .registerAutocompleteListener((query, args) => {
     return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
       console.error('Do that');;
     });
   });

   //countdown_timer_changed
  let countdown_timer_changed = homey.flow.getTriggerCard('countdown_timer_changed');
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
    
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
        console.error('Do that');;
      });
    });



///// CONDITIONS ////

  //timer_running
  let timer_running = homey.flow.getConditionCard('timer_running');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_matches_number
  let timer_matches_number = homey.flow.getConditionCard('timer_matches_number');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_less_than_number
  let timer_less_than_number = homey.flow.getConditionCard('timer_less_than_number');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_greater_than_number
  let timer_greater_than_number = homey.flow.getConditionCard('timer_greater_than_number');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //timer_paused
  let timer_paused = homey.flow.getConditionCard('timer_paused');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

//// ACTIONS ////

  //set_countdown_timer
  let set_countdown_timer = homey.flow.getActionCard('set_countdown_timer');
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
          return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
    }
  })
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //set_random_countdown_timer
  let set_random_countdown_timer = homey.flow.getActionCard('set_random_countdown_timer');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //adjust_countdown_timer
  let adjust_countdown_timer = homey.flow.getActionCard('adjust_countdown_timer');
  adjust_countdown_timer
  .registerRunListener((args, state) => {
    //console.log(args);  // this is the user input
    //console.log(state);  // this is the state parameter, as passed in trigger()

    //   If true, this flow should run
    if (args.variable && args.variable.name) {
      console.log('flow: adjust_countdown_timer ' + args.variable.name)
      var result = variableManager.getVariable(args.variable.name);
      homey.log('was: ' + result.value)
      homey.log('change: ' + args.value)
      var newTimervalue = Number(args.value) + Number(result.value);
      if (newTimervalue < 0 ) { newTimervalue = 0 };
      homey.log('new value: ' + newTimervalue);
        //var result = variableManager.getVariable(args.variable.name);
        //if (result) {
          return Promise.resolve(variableManager.updateVariable(args.variable.name, newTimervalue, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        //}
      }
  })
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });


  //stop_countdown_timer
  let stop_countdown_timer = homey.flow.getActionCard('stop_countdown_timer');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //pause_countdown_timer
  let pause_countdown_timer = homey.flow.getActionCard('pause_countdown_timer');
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
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //resume_countdown_timer
  let resume_countdown_timer = homey.flow.getActionCard('resume_countdown_timer');
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
          return Promise.resolve(variableManager.updateVariable(args.variable.name, result.value, 'number', '0')).catch(() => {
            console.error('Do that');;
          });
        }
      }
  })
  
  .getArgument('variable')
  .registerAutocompleteListener((query, args) => {
    return Promise.resolve(retrieveCountdowns(query, args)).catch(() => {
      console.error('Do that');;
    });
  });

  //stop_all_countdown_timers
  let stop_all_countdown_timers = homey.flow.getActionCard('stop_all_countdown_timers');
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
  
  //.getArgument('variable')
//  .registerAutocompleteListener((query, args) => {
//    return Promise.resolve(retrieveCountdowns(query, args));
//  });
} // CreateFlowCardTriggers

}

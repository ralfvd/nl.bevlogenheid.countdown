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

  // if_variable_set
  let if_variable_set = new Homey.FlowCardTrigger('if_variable_set');
  if_variable_set.register()
      .on('run', (args, state, callback) => {
          if (args.variable && state.variable && args.variable.name == state.variable) {
              callback(null, true); // true to make the flow continue, or false to abort
              return;
          }
          callback(null, false); // true to make the flow continue, or false to abort
      })
      .getArgument('variable')
      .registerAutocompleteListener((query, args) => {
          return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
      });
      
  //countdown_to_zero
  let countdown_to_zero = new Homey.FlowCardTrigger('countdown_to_zero');
  countdown_to_zero.register()
    .on('run', (args,callback,state) => {
      if ( args.variable.name == state.variable ) {
              callback(null,true);
              return;
         } else {
              callback(null, false); // true to make the flow continue, or false to abort
       }
    })
    .getArgument('variable')
    .registerAutocompleteListener((query, args) => {
      return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
    });



  }
}

//Homey.manager('flow').on('trigger.countdown_to_zero', function (callback,args,state) {
//
//});

//Homey.manager('flow').on('trigger.countdown_started', function (callback,args,state) {
//if (args.variable.name == state.variable) {
//  callback(null,true);
//  return;
// } else {
//callback(null, false); // true to make the flow continue, or false to abort/
//}
//});

//Homey.manager('flow').on('trigger.countdown_stopped', function (callback,args,state) {
//if ( args.variable.name == state.variable ) {
//    callback(null,true);
//    return;
 //} else {
//callback(null, false); // true to make the flow continue, or false to abort/
//}
//});

//Homey.manager('flow').on('trigger.countdown_timer_changed', function (callback,args,state) {
//if ( args.variable.name == state.variable ) {
    //Homey.log(args);
//    callback(null,true);
//    return;
 //} else {
//callback(null, false); // true to make the flow continue, or false to abort
//}
//});

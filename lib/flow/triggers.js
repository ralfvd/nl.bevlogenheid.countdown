var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createTriggers = function () {

    Homey.manager('flow').on('trigger.countdown_to_zero', function (callback,args,state) {
	Homey.log('----Flow: countdown_to_zero--');	
	Homey.log(args);
  	Homey.log(state);
       	if (args.amount == 0) {
		callback(null,true);
		return;
	   } else {
		callback(null, false); // true to make the flow continue, or false to abort
	 }
   });
    
}


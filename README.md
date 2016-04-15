### Homey CountDown timer
This is a CountDown timer which you can use to initiate flows.

Examples: When motion is detected, turn on light and start a timer for 90 seconds
	  After 11 seconds, when motion is detected again, restart the timer for 90 seconds
	  When the timer reaches 0, there was no motion for 90 seconds, turn off the light.

### Settings
After installing the application, first visit the Homey Settings and navigate to the 'CountDown' application.

There you can add CountDown timers.  If you already enter a value, it will immediately start counting down.
If you see a value '-1', this means the countdown timer is not active and waiting to be set ( via an action card  in the flow )

### Flow support

*Triggers* 

There is 1 trigger: when a CountDown timer reaches 0. 

*Actions*

There are 2 actions:

- Start CountDown timer: set a value and a number (in seconds)
- Stop CountDown timer: the CountDown timer will be stopped (and resetted)

*Conditions*

No condition cards

### Speech

No speech support

#### Acknowledgement

The CountDown timer is heavily influenced and inspired by the BetterLogic app. https://apps.athom.com/app/net.i-dev.betterlogic

### ToDo

- Clean-up code
- Optimize 'settings' screen 
- Translation to NL

### Known bugs

- Settings screen doesn't always update if a countdown timer updates

### Changelog

v0.0.1 2016-04-15 : First public release 


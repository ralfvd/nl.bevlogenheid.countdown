### Homey CountDown timer
This is a CountDown timer which you can use to initiate flows.

Examples: When motion is detected, turn on light and start a timer for 90 seconds
	  After 11 seconds, when motion is detected again, restart the timer for 90 seconds
	  When the timer reaches 0, there was no motion for 90 seconds, turn off the light.

### Settings
After installing the application, first visit the Homey Settings and navigate to the 'CountDown' application.

There you can add CountDown timers.

If you see a value '-1', this means the countdown timer is not active and waiting to be set ( via an action card in the flow )

### Flow support

*Triggers*

There is 1 trigger: when a CountDown timer reaches 0.

*Actions*

There are 3 actions:

- Start CountDown timer: set a value and a number (in seconds)
- Start random CountDown timer: set a value and a range (inclusive); when action starts, it will randomly selected a number between 'min' and 'max' (including those numbers) and start the CountDown timer.
- Stop CountDown timer: the CountDown timer will be stopped (and reset)

*Conditions*

There is one condition card:

- Timer is (not) running: check whether a timer is running (or not)

### Speech

No speech support

#### Acknowledgement

The CountDown timer is heavily influenced and inspired by the BetterLogic app. https://apps.athom.com/app/net.i-dev.betterlogic

The Condition card was suggested (and code provided) by GeurtDijker

### Donate

If you like the app, consider a donation to support development  
[![Paypal donate][pp-donate-image]][pp-donate-link]

### ToDo

- Clean-up code
- Translation to NL

### Known bugs

- (solved in 0.0.3) Memory leak could cause the app to crash if running many timers for a period of time
- Settings screen doesn't always update if a countdown timer updates
    - Workaround: Click 'CountDown' again in left-bar, after this, page will update when a timer is running

### Changelog

- V0.2.0 2016-07-20 : Added random CountDown action card
- V0.1.0 2016-05-20 : Added condition card, fixed app for 0.8.35 compatability
- V0.0.3 2016-04-18 : Optimized memory & cpu usage: the memory leak shouldn't be occuring anymore
- V0.0.2 2016-04-16 : Optimized settings screen
- V0.0.1 2016-04-15 : First public release

[pp-donate-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ralf%40iae%2enl&lc=GB&item_name=homey%2dcountdown&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted
[pp-donate-image]: https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif

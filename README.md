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

There are 4 triggers
	- When a CountDown timer reaches 0. This will be the most used trigger.
	- When a CountDown timer has started
	- When a CountDown timer has stopped before reaching 0.
	- When a CountDown timer has changed its value

*Actions*

There are 3 actions:

- Start CountDown timer: set a value and a number (in seconds)
- Start random CountDown timer: set a value and a range (inclusive); when action starts, it will randomly selected a number between 'min' and 'max' (including those numbers) and start the CountDown timer
- Adjust CountDown timer: increase or decrease (with negative numbers) a running CountDown timer
- Stop CountDown timer: the CountDown timer will be stopped (and reset)
- Stop all CountDown timers: All CountDown timers will be stopped (and reset)

*Conditions*

There are 4 condition cards:

- Timer is (not) running: check whether a timer is running (or not)
- Timer is (not) exactly value: to be used in combination with the 'value changed' trigger card. You can use this to check if a CountDown timer has reached a certain value.
- Timer is less/greater than: check if a CountDown timer has a value less/greater than a specified value

### Speech

No speech support

#### Acknowledgement

The CountDown timer is heavily influenced and inspired by the BetterLogic app. https://apps.athom.com/app/net.i-dev.betterlogic

The Condition card was suggested (and code provided) by GeurtDijker

The Start/Stop triggers cards were suggested by MarkSwift

Import / Export code by Patrick Sannes ( Better Logic app )

The trigger/condition combination for checking a value was suggested by YvesGeffens

Readable format of timer dates in settings menu was provided by jghaanstra

Greater than/less than conditions was coded by Petter Alstermark

### Donate

If you like the app, consider a donation to support development  
[![Paypal donate][pp-donate-image]][pp-donate-link]

### ToDo

- Clean-up code
- Translation to NL

### Known bugs

- Settings screen doesn't always update if a countdown timer updates
    - Workaround: Click 'CountDown' again in left-bar, after this, page will update when a timer is running

### Changelog

- V2.0.3 2018-12-09 : Code clean-up
- V2.0.2 2018-12-08 : Bugfix of bugfix
- V2.0.1 2018-12-07 : Bugfix for one trigger card
- V2.0.0 2018-12-07 : SDK2 enabled
- V1.2.5 2018-03-18 : Bugfix adjust timer
- V1.2.4 2018-03-17 : Revert part of input validation, bug in action and conditions cards
- V1.2.3 2018-03-16 : Bugfix when upgrading from < 1.2
- V1.2.2 2018-03-14 : Fixed GitHub issue #9 ; improved input validation
- V1.2.1 2018-03-12 : Added greater than/less than conditions, added Sentry logging
- V1.1.2 2017-11-27 : Fix the bugfix of adjust timer
- V1.1.1 2017-11-16 : Bugfix autocomplete adjust timer
- V1.1.0 2017-11-15 : Bugfix global tags
- V1.0.7 2017-11-14 : Add global tags support
- V1.0.6 2017-10-27 : Add 'adjust timer' action card
- V1.0.5 2017-10-27 : Add 'stop all timers' action card
- V1.0.4 2016-12-20 : Human readable format for LastChanged dates in settings menu
- V1.0.3 2016-12-05 : Fixed bug for tokens in action card when CountDown value changed
- V1.0.1 2016-11-16 : Added trigger/condition combination to check value of a CountDown timer
- V1.0.0 2016-11-01 : Added start/stop Countdown trigger cards, implemented export/import
- V0.2.0 2016-07-20 : Added random CountDown action card
- V0.1.0 2016-05-20 : Added condition card, fixed app for 0.8.35 compatability
- V0.0.3 2016-04-18 : Optimized memory & cpu usage: the memory leak shouldn't be occuring anymore
- V0.0.2 2016-04-16 : Optimized settings screen
- V0.0.1 2016-04-15 : First public release

[pp-donate-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ralf%40iae%2enl&lc=GB&item_name=homey%2dcountdown&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted
[pp-donate-image]: https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif

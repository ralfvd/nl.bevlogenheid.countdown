Homey CountDown timer

This is a CountDown app which you can use to initiate flows.

Examples: When motion is detected, turn on light and start a timer for 90 seconds
	  After 11 seconds, when motion is detected again, restart the timer for 90 seconds
	  When the timer reaches 0, there was no motion for 90 seconds, turn off the light.

Settings

After installing the application, first visit the Homey Settings and navigate to the 'CountDown' application.

There you can add/delete CountDown timers.

If you see a value '-1', this means the countdown timer is not active and waiting to be set ( via an action card in the flow )

Flow support

-Triggers-

There are 6 triggers
	1) When a CountDown timer reaches 0. This will be the most used trigger.
	2) When a CountDown timer has started
  3) When a CountDown timer has stopped before reaching 0.
	4) When a CountDown timer has changed its value (by running)
	5) When a CountDown timer has been updated via a flow or manually (while running)
	6) A combination of 2 and 5 ; so either started or changed via flow/manually

-Actions-

There are 5 actions:

- Start CountDown timer: set a value and a number (in seconds)
- Start random CountDown timer: set a value and a range (inclusive); when action starts, it will randomly selected a number between 'min' and 'max' (including those numbers) and start the CountDown timer
- Adjust CountDown timer: increase or decrease (with negative numbers) a running CountDown timer
- Stop CountDown timer: the CountDown timer will be stopped (and reset)
- Stop all CountDown timers: All CountDown timers will be stopped (and reset)

-Conditions-

There are 4 condition cards:

- Timer is (not) running: check whether a timer is running (or not)
- Timer is (not) exactly value: to be used in combination with the 'value changed' trigger card. You can use this to check if a CountDown timer has reached a certain value.
- Timer is less/greater than: check if a CountDown timer has a value less/greater than a specified value

Acknowledgements

The CountDown app is heavily influenced and inspired by the BetterLogic app.

The Condition card was suggested (and code provided) by GeurtDijker

The Start/Stop triggers cards were suggested by MarkSwift

Import / Export code by Patrick Sannes ( Better Logic app )

The trigger/condition combination for checking a value was suggested by YvesGeffens

Readable format of timer dates in settings menu was provided by jghaanstra

Greater than/less than conditions was coded by Petter Alstermark

Donate

If you like the app, consider a donation to support development

ToDo

- Clean-up code
- Translation to NL

### Homey CountDown timer
This is a CountDown timer which you can use to initiate flows.

Examples: When motion is detected, turn on light and start a timer for 90 seconds
	  After 11 seconds, when motion is detected again, restart the timer for 90 seconds
	  When the timer reaches 0, there was no motion for 90 seconds, turn off the light.

### Settings

After installing the application, you can create CountDown timers in a flow.

In the app settings of CountDown, you can also add, remove, import and export timers.

If you see a value '-1', this means the countdown timer is not active and waiting to be set ( via an action card in the flow )

### Flow support

*Triggers*

	- When a CountDown timer reaches 0. This will be the most used trigger.
	- When a CountDown timer reaches a certain value
	- When a CountDown timer has started
	- When a CountDown timer has stopped before reaching 0.
	- When a CountDown timer has changed its value
	- When a CountDown timer has started or updated.

*Actions*

- Start CountDown timer: set a value and a number (in seconds)
- Start random CountDown timer: set a value and a range (inclusive); when action starts, it will randomly selected a number between 'min' and 'max' (including those numbers) and start the CountDown timer
- Adjust CountDown timer: increase or decrease (with negative numbers) a running CountDown timer
- Stop CountDown timer: the CountDown timer will be stopped (and reset)
- Stop all CountDown timers: All CountDown timers will be stopped (and reset)
- Pause / remove CountDown timer: a timer will be paused or resumed. The value will be retained.

*Conditions*

There are 4 condition cards:

- Timer is (not) running: check whether a timer is running (or not)
- Timer is (not) exactly value: to be used in combination with the 'value changed' trigger card. You can use this to check if a CountDown timer has reached a certain value.
- Timer is less/greater than: check if a CountDown timer has a value less/greater than a specified value
- Timer is (not) paused: check if a timer is paused

#### Acknowledgement

The CountDown timer is heavily influenced and inspired by the BetterLogic app.

SDK3 rewrite was mainly done by Arie J. Godschalk

The Condition card was suggested (and code provided) by GeurtDijker

The Start/Stop triggers cards were suggested by MarkSwift

Import / Export code by Patrick Sannes

The trigger/condition combination for checking a value was suggested by YvesGeffens

Readable format of timer dates in settings menu was provided by jghaanstra

Greater than/less than conditions was coded by Petter Alstermark

### Donate

If you like the app, consider a donation to support development  

### ToDo

- Clean-up code
- Translation to NL

### Known bugs

- Settings screen doesn't always update if a countdown timer updates
    - Workaround: Click 'CountDown' again in left-bar, after this, page will update when a timer is running

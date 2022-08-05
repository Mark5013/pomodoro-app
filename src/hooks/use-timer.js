import { useState, useContext, useEffect } from "react";
import UserContext from "../store/userContext";
import ModeContext from "../store/modeContext";
import SettingsContext from "../store/settingsContext";
import useHttpRequest from "../hooks/use-HttpRequest";
import SilkAlarm from "../static/Audio/SilkAlarm.mp3";

let interval;
let timerLength;

function useTimer() {
	const settingsContext = useContext(SettingsContext);
	const userCtx = useContext(UserContext);
	const modeCtx = useContext(ModeContext);
	const sendRequest = useHttpRequest();
	const [minutes, setMinutes] = useState("25");
	const [seconds, setSeconds] = useState("00");
	const [counter, setCounter] = useState(0);
	const [hasError, setHasError] = useState(false);
	const [timerRunning, setTimeRunning] = useState(false);
	// browser restricts loading resources when tab is inactive, so sound must be loaded out here
	const alarm = { audio: SilkAlarm };
	const sound = new Audio(alarm.audio);

	// will play alarm sound whenever a timer ends
	function playSound() {
		// create audio object and set volume, might allow users to customize later

		sound.volume = 0.15;
		sound.play();

		// fade audio out
		const audioInterval = setInterval(() => {
			if (sound.paused || sound.volume === 0) {
				clearInterval(audioInterval);
			}
			if (sound.volume > 0) {
				sound.volume -= 0.03;
			}
		}, 1000);

		// pause the audio after 5 seconds
		setTimeout(() => sound.pause(), 5000);
	}

	function toggleError() {
		setHasError((prev) => !prev);
	}

	useEffect(() => {
		setMinutes(settingsContext.pomodoroModeLength);
	}, [settingsContext.pomodoroModeLength]);

	// updates how long a user has spent in pomodoro mode
	async function updateMinutes(dateStr, millisecondsPassed) {
		const message = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/stats/updateMinutes`,
			"POST",
			{ "Content-type": "application/json" },
			JSON.stringify({
				dateStr,
				millisecondsPassed,
				userId: userCtx.user.userId,
			})
		);
	}

	// sets app UI and logic to pomodoro mode
	function setPomodoroMode() {
		//TODO IF TIMER RUNNING ALERT USER
		if (timerRunning) {
			alert("Timer will be reset, click ok to continue");
		}
		// CLEAR TIMER, SWITCH MODE, UPDATE TIMERLENGTH TO POMODOROMODE LENGTH AND UPDATE MINUTES/SECONDS
		clearTimer();
		modeCtx.switchMode("pomodoro");
		setMinutes(settingsContext.pomodoroModeLength);
		timerLength =
			Number(settingsContext.pomodoroModeLength) * 60000 +
			Number("00") * 1000;
		setSeconds("00");
	}

	// sets app UI and logic to short break mode
	function setShortBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
		if (timerRunning) {
			alert("Timer will be reset, click ok to continue");
		}
		// CLEAR TIMER, MAKE SURE USER IS LOGGED IN, TIME IN POMODORO MODE IS > 0 AND WE ARE COMING FROM POMODORO MODE, THEN UPDATE MINUTES
		// ALSO SWITCH MODE, SET MINUTES/SECONDS, AND SET TIMERLENGTH TO SHORT BREAK LENGTH
		clearTimer();

		if (
			userCtx.user.isLoggedIn &&
			parseInt(settingsContext.pomodoroModeLength) * 60000 - timerLength >
				0 &&
			modeCtx.mode === "pomodoro"
		) {
			updateMinutes(
				new Date().toISOString().split("T")[0],
				parseInt(settingsContext.pomodoroModeLength) * 60000 -
					timerLength
			);
		}
		modeCtx.switchMode("shortBreak");
		setMinutes(settingsContext.shortBreakLength);
		timerLength =
			Number(settingsContext.shortBreakLength) * 60000 +
			Number("00") * 1000;

		setSeconds("00");
	}

	// sets app UI and logic to long break mode
	function setLongBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
		if (timerRunning) {
			alert("Timer will be reset, click ok to continue");
		}
		// CLEAR TIMER, CHECK THAT USER IS LOGGED IN, TIME SPENT IN POMORODO MODE IS > 0 AND WE ARE COMING FROM POMODORO MODE, THEN UPDATE MINUTES
		// ALSO SWITCH MODE, SET MINUTES/SECONDS, AND SET TIMER LENGTH TO LONG BREAK LENGTH
		clearTimer();
		if (
			userCtx.user.isLoggedIn &&
			parseInt(settingsContext.pomodoroModeLength) * 60000 - timerLength >
				0 &&
			modeCtx.mode === "pomodoro"
		) {
			updateMinutes(
				new Date().toISOString().split("T")[0],
				parseInt(settingsContext.pomodoroModeLength) * 60000 -
					timerLength
			);
		}
		modeCtx.switchMode("longBreak");
		setMinutes(settingsContext.longBreakLength);
		timerLength =
			Number(settingsContext.longBreakLength) * 60000 +
			Number("00") * 1000;
		setSeconds("00");
	}

	// clears current interval, AKA pauses the timer
	function clearTimer() {
		setTimeRunning(false);
		clearInterval(interval);
	}

	// controls timer displays on screen
	function startTimer() {
		// convert minutes and seconds to milliseconds
		timerLength = Number(minutes) * 60000 + Number(seconds) * 1000;
		setTimeRunning(true);

		interval = setInterval(() => {
			// decrement timer length by 1 second every second
			timerLength -= 1000;

			// if timerLength hits 0, clear the intervals
			if (timerLength <= 0) {
				if (counter === 3 && modeCtx.mode === "pomodoro") {
					setCounter(0);
					setLongBreakMode();
				} else if (modeCtx.mode === "pomodoro") {
					setCounter((prev) => prev + 1);
					setShortBreakMode();
				} else if (modeCtx.mode === "longBreak") {
					setPomodoroMode();
				} else {
					setPomodoroMode();
				}
				playSound();
				clearTimer();
			} else {
				setMinutes(
					String(
						Math.floor(
							(timerLength % (1000 * 60 * 60)) / (1000 * 60)
						)
					).padStart(2, "0")
				);
				setSeconds(
					String(
						Math.floor((timerLength % (1000 * 60)) / 1000)
					).padStart(2, "0")
				);
			}
		}, 1000);
	}

	return {
		minutes,
		seconds,
		hasError,
		setPomodoroMode,
		setShortBreakMode,
		setLongBreakMode,
		clearTimer,
		startTimer,
		toggleError,
	};
}

export default useTimer;

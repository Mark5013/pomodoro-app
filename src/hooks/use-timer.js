import { useState, useContext, useEffect } from "react";
import UserContext from "../store/userContext";
import ModeContext from "../store/modeContext";
import SettingsContext from "../store/settingsContext";
let interval;
let timerLength;

function useTimer() {
	const settingsContext = useContext(SettingsContext);
	const userCtx = useContext(UserContext);
	const modeCtx = useContext(ModeContext);

	const [minutes, setMinutes] = useState("25");
	const [seconds, setSeconds] = useState("00");
	const [counter, setCounter] = useState(0);
	const [hasError, setHasError] = useState(false);

	function toggleError() {
		setHasError((prev) => !prev);
	}

	useEffect(() => {
		setMinutes(settingsContext.pomodoroModeLength);
	}, [settingsContext.pomodoroModeLength]);

	// updates how long a user has spent in pomodoro mode
	async function updateMinutes(dateStr, millisecondsPassed) {
		let response;
		let message;
		try {
			response = await fetch(
				"http://localhost:5000/stats/updateMinutes",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						dateStr,
						millisecondsPassed,
						userId: userCtx.user.userId,
					}),
				}
			);

			message = await response.json();
		} catch (err) {
			console.log(err);
			console.log(message);
			toggleError();
		}
	}

	// sets app UI and logic to pomodoro mode
	function setPomodoroMode() {
		//TODO IF TIMER RUNNING ALERT USER
		clearTimer();
		modeCtx.switchMode("pomodoro");
		setMinutes(settingsContext.pomodoroModeLength);
		setSeconds("00");
	}

	// sets app UI and logic to short break mode
	function setShortBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
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
		setSeconds("00");
	}

	// sets app UI and logic to long break mode
	function setLongBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
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
		setSeconds("00");
	}

	// clears current interval, AKA pauses the timer
	function clearTimer() {
		clearInterval(interval);
	}

	// controls timer displays on screen
	function startTimer() {
		// convert minutes and seconds to milliseconds
		timerLength = Number(minutes) * 60000 + Number(seconds) * 1000;

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

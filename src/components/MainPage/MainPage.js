import styles from "./MainPage.module.css";
import { useContext, useState } from "react";
import ModeContext from "../../store/modeContext";

import Header from "../Shared/Header/Header";
import TimerCard from "./UI/TimerCard";
import Button from "../Shared/UI/Button";
import TaskList from "./UI/TaskList";

let interval;

function MainPage() {
	const [minutes, setMinutes] = useState("25");
	const [seconds, setSeconds] = useState("00");
	const [counter, setCounter] = useState(0);
	const modeCtx = useContext(ModeContext);

	// sets app UI and logic to pomodoro mode
	function setPomodoroMode() {
		//TODO IF TIMER RUNNING ALERT USER
		clearTimer();
		modeCtx.switchMode("pomodoro");
		setMinutes("25");
		setSeconds("00");
	}

	// sets app UI and logic to short break mode
	function setShortBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
		clearTimer();
		modeCtx.switchMode("shortBreak");
		setMinutes("05");
		setSeconds("00");
	}

	// sets app UI and logic to long break mode
	function setLongBreakMode() {
		//TODO IF TIMER RUNNING ALERT USER
		clearTimer();
		modeCtx.switchMode("longBreak");
		setMinutes("15");
		setSeconds("00");
	}

	// clears current interval, AKA pauses the timer
	function clearTimer() {
		clearInterval(interval);
	}

	// controls timer displays on screen
	function startTimer() {
		// convert minutes and seconds to milliseconds
		let timerLength = Number(minutes) * 60000 + Number(seconds) * 1000;
		console.log(timerLength);

		interval = setInterval(() => {
			// decrement timer length by 1 second every second
			timerLength -= 1000;
			// if timerLength hits 0, clear the intervals
			if (timerLength <= 0) {
				if (counter == 3 && modeCtx.mode === "pomodoro") {
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

	return (
		<>
			<div
				className={`${styles.background} ${
					modeCtx.mode === "pomodoro"
						? styles.pomodoroBackground
						: modeCtx.mode === "shortBreak"
						? styles.shortBreakBackground
						: modeCtx.mode === "longBreak"
						? styles.longBreakBackground
						: ""
				}`}>
				<Header />
				<TimerCard mode={modeCtx.mode}>
					<div className={styles.timerButtons}>
						<Button
							text="Pomodoro"
							type="button"
							onClick={setPomodoroMode}
							style="timerButton"
						/>
						<Button
							text="Short Break"
							type="button"
							onClick={setShortBreakMode}
							style="timerButton"
						/>
						<Button
							text="Long Break"
							type="button"
							onClick={setLongBreakMode}
							style="timerButton"
						/>
					</div>
					<p className={styles.timerText}>
						{minutes}:{seconds}
					</p>
					<div className={styles.bottomButtons}>
						<Button
							text="Start"
							type="button"
							onClick={startTimer}
							style="timerButton"
						/>
						<Button
							text="Pause"
							type="button"
							onClick={clearTimer}
							style="timerButton"
						/>
					</div>
				</TimerCard>
				<TaskList />
			</div>
		</>
	);
}

export default MainPage;

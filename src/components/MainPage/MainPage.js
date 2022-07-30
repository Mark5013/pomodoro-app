import styles from "./MainPage.module.css";
import { useContext } from "react";
import ModeContext from "../../store/modeContext";
import useTimer from "../../hooks/use-timer";

import Header from "../Shared/Header/Header";
import TimerCard from "./UI/TimerCard";
import Button from "../Shared/UI/Button";
import TaskList from "./UI/TaskList";
import Footer from "../Shared/Footer/Footer";

function MainPage() {
	const modeCtx = useContext(ModeContext);
	const {
		minutes,
		seconds,
		setPomodoroMode,
		setShortBreakMode,
		setLongBreakMode,
		clearTimer,
		startTimer,
	} = useTimer();

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
							class="timerButton"
						/>
						<Button
							text="Short Break"
							type="button"
							onClick={setShortBreakMode}
							class="timerButton"
						/>
						<Button
							text="Long Break"
							type="button"
							onClick={setLongBreakMode}
							class="timerButton"
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
							class="timerButton"
						/>
						<Button
							text="Pause"
							type="button"
							onClick={clearTimer}
							class="timerButton"
						/>
					</div>
				</TimerCard>
				<TaskList />
				<Footer />
			</div>
		</>
	);
}

export default MainPage;

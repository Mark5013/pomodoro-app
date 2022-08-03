import styles from "./MainPage.module.css";
import { useContext, useEffect } from "react";
import ModeContext from "../../store/modeContext";
import useTimer from "../../hooks/use-timer";
import Header from "../Shared/Header/Header";
import TimerCard from "./UI/TimerCard";
import { Button } from "@mui/material";
import TaskList from "./UI/TaskList";
import Footer from "../Shared/Footer/Footer";
import ErrorModal from "../Shared/UI/ErrorModal";

function MainPage() {
	const modeCtx = useContext(ModeContext);
	const {
		minutes,
		seconds,
		hasError,
		setPomodoroMode,
		setShortBreakMode,
		setLongBreakMode,
		clearTimer,
		startTimer,
		toggleError,
	} = useTimer();

	useEffect(() => {
		document.title = `${minutes}:${seconds}`;
	}, [seconds]);
	console.log("render");
	return (
		<>
			{hasError && (
				<ErrorModal
					closeErrorModal={toggleError}
					errorText="Failed to save user data"
				/>
			)}
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
							variant="contained"
							color="inherit"
							onClick={setPomodoroMode}
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Pomodoro
						</Button>
						<Button
							variant="contained"
							color="inherit"
							onClick={setShortBreakMode}
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Short Break
						</Button>
						<Button
							variant="contained"
							color="inherit"
							onClick={setLongBreakMode}
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Long Break
						</Button>
					</div>
					<p className={styles.timerText}>
						{minutes}:{seconds}
					</p>
					<div className={styles.bottomButtons}>
						<Button
							variant="contained"
							color="inherit"
							onClick={startTimer}
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Start
						</Button>
						<Button
							variant="contained"
							color="inherit"
							onClick={clearTimer}
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Pause
						</Button>
					</div>
				</TimerCard>
				<TaskList />
				<Footer />
			</div>
		</>
	);
}

export default MainPage;

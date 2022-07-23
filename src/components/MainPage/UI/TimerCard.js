import styles from "./TimerCard.module.css";
import { useContext } from "react";
import ModeContext from "../../../store/modeContext";

function TimerCard(props) {
	const modeCtx = useContext(ModeContext);

	return (
		<div
			className={`${styles.card} ${
				modeCtx.mode === "pomodoro"
					? styles.pomodoroMode
					: modeCtx.mode === "shortBreak"
					? styles.shortBreakMode
					: modeCtx.mode === "longBreak"
					? styles.longBreakMode
					: ""
			}`}>
			<div className={styles.children}>{props.children}</div>
		</div>
	);
}

export default TimerCard;

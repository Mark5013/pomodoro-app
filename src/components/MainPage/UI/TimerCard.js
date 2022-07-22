import styles from "./TimerCard.module.css";
import Button from "../../Shared/UI/Button";

function TimerCard(props) {
	return (
		<div
			className={`${styles.card} ${
				props.timerRunning
					? styles.timerRunningBackground
					: styles.timerPausedBackground
			}`}>
			<div className={styles.timerButtons}>
				<Button text="Pomodoro" type="button" />
				<Button text="Short Break" type="button" />
				<Button text="Long Break" type="button" />
			</div>
			<p className={styles.timerText}>
				{props.minutes}:{props.seconds}
			</p>
			<div>{props.children}</div>
		</div>
	);
}

export default TimerCard;

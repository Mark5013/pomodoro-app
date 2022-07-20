import styles from "./TimerCard.module.css";

function TimerCard(props) {
	return (
		<div
			className={`${styles.card} ${
				props.timerRunning
					? styles.timerRunningBackground
					: styles.timerPausedBackground
			}`}>
			{props.children}
		</div>
	);
}

export default TimerCard;

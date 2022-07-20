import styles from "./TimerCard.module.css";

function TimerCard(props) {
	return (
		<div
			className={`${styles.card} ${
				props.timerRunning
					? styles.timerRunningBackground
					: styles.timerPausedBackground
			}`}>
			<h2>{props.timer}</h2>
			<p>
				{props.minutes}:{props.seconds}
			</p>
			<div>{props.children}</div>
		</div>
	);
}

export default TimerCard;

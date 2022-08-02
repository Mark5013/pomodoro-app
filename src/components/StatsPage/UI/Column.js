import styles from "./Column.module.css";

function Column(props) {
	return (
		<div className={styles.col}>
			<div className={styles.bar}>
				<div
					className={styles.height}
					style={{
						height: `${props.curTime * 0.348}px`,
					}}></div>
			</div>
			<p>{props.curTime.toFixed(2)} min</p>
			<p>{props.curDate}</p>
		</div>
	);
}

export default Column;

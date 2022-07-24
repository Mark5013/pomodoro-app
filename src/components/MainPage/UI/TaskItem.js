import styles from "./TaskItem.module.css";

function TaskItem(props) {
	return (
		<div className={styles.task}>
			<div>{props.task.title}</div>
			<div>{props.task.description}</div>
		</div>
	);
}

export default TaskItem;

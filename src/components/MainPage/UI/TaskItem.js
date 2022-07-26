import styles from "./TaskItem.module.css";
import LongMenu from "../../Shared/UI/LongMenu";

function TaskItem(props) {
	return (
		<div className={styles.task}>
			<div>
				<div>{props.task.title}</div>
				<div>{props.task.description}</div>
			</div>
			<LongMenu taskId={props.taskId} editTaskList={props.editTaskList} />
		</div>
	);
}

export default TaskItem;

import styles from "./TaskItem.module.css";
import LongMenu from "../../Shared/UI/LongMenu";
import { Draggable } from "react-beautiful-dnd";

function TaskItem(props) {
	return (
		<Draggable draggableId={props.taskId} index={props.index}>
			{(provided) => (
				<div
					className={styles.task}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}>
					<div className={styles.content}>
						<div className={styles.title}>{props.task.title}</div>
						<div className={styles.description}>
							{props.task.description}
						</div>
					</div>
					<LongMenu
						taskId={props.taskId}
						editTaskList={props.editTaskList}
					/>
				</div>
			)}
		</Draggable>
	);
}

export default TaskItem;

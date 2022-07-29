import styles from "./TaskItem.module.css";
import LongMenu from "../../Shared/UI/LongMenu";
import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import TaskForm from "./TaskForm";

function TaskItem(props) {
	const [editMode, setEditMode] = useState(false);

	function handleEditMode() {
		setEditMode((prev) => !prev);
	}

	function handleEdit(task) {
		props.editTaskItem(task, props.taskId);
	}

	let content = editMode ? (
		<TaskForm
			titleText={props.task.title}
			descriptionText={props.task.description}
			toggleForm={handleEditMode}
			addTask={handleEdit}
		/>
	) : (
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
						deleteTaskItem={props.deleteTaskItem}
						editTaskItem={handleEditMode}
					/>
				</div>
			)}
		</Draggable>
	);

	return content;
}

export default TaskItem;

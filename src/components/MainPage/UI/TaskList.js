import styles from "./TaskList.module.css";

import { useState } from "react";
import TaskItem from "./TaskItem";
import Button from "../../Shared/UI/Button";
import TaskForm from "./TaskForm";

function TaskList() {
	let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

	const [showForm, setShowForm] = useState(false);
	const [taskList, setTaskList] = useState(tasks);

	function toggleForm() {
		setShowForm((prev) => !prev);
	}

	function addTask(task) {
		tasks.push({
			title: task.title,
			description: task.description,
			id: task.id,
		});
		setTaskList(tasks);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	return (
		<div className={styles.listContainer}>
			<h2>Tasks</h2>
			<hr />
			{showForm ? (
				<TaskForm toggleForm={toggleForm} addTask={addTask} />
			) : (
				<Button
					type={"button"}
					text={"Add a task"}
					class={"addTaskButton"}
					onClick={toggleForm}
				/>
			)}

			<ul className={styles.list}>
				{taskList.map((task) => (
					<TaskItem
						task={task}
						key={task.id}
						taskId={task.id}
						editTaskList={setTaskList}
					/>
				))}
			</ul>
		</div>
	);
}

export default TaskList;

import styles from "./TaskList.module.css";

import { useState } from "react";
import TaskItem from "./TaskItem";
import Button from "../../Shared/UI/Button";
import TaskForm from "./TaskForm";

let DUMMY_TASKS = [
	{ title: "Task One", description: "hiya", id: "1" },
	{ title: "Task Two", description: "wowow", id: "2" },
	{ title: "Task Three", description: "epic", id: "3" },
	{ title: "Task Four", description: "COOOL", id: "4" },
];

function TaskList() {
	const [showForm, setShowForm] = useState(false);

	function toggleForm() {
		setShowForm((prev) => !prev);
	}

	function addTask(task) {
		DUMMY_TASKS.push(task);
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
					style={"addTaskButton"}
					onClick={toggleForm}
				/>
			)}

			<ul className={styles.list}>
				{DUMMY_TASKS.map((task) => (
					<TaskItem task={task} key={task.id} />
				))}
			</ul>
		</div>
	);
}

export default TaskList;

import styles from "./TaskList.module.css";

import TaskItem from "./TaskItem";
import Button from "../../Shared/UI/Button";

const DUMMY_TASKS = [
	{ title: "Task One", description: "hiya", id: "1" },
	{ title: "Task Two", description: "wowow", id: "2" },
	{ title: "Task Three", description: "epic", id: "3" },
	{ title: "Task Four", description: "COOOL", id: "4" },
];

function TaskList() {
	return (
		<div className={styles.listContainer}>
			<h2>Tasks</h2>
			<hr />
			<Button type={"button"} text={"Add a task"} />
			<ul className={styles.list}>
				{DUMMY_TASKS.map((task) => (
					<TaskItem task={task} key={task.id} />
				))}
			</ul>
		</div>
	);
}

export default TaskList;

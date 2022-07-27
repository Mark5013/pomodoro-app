import styles from "./TaskList.module.css";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import Button from "../../Shared/UI/Button";
import TaskForm from "./TaskForm";
import ErrorModal from "../../Shared/UI/ErrorModal";

function TaskList() {
	let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

	const [showForm, setShowForm] = useState(false);
	const [taskList, setTaskList] = useState(tasks);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorModalText, setErrorModalText] = useState("");

	function toggleForm() {
		setShowForm((prev) => !prev);
	}

	function toggleErrorModal(errorText) {
		if (errorText.length === 0) {
			setErrorModalText("");
		} else {
			setErrorModalText(errorText);
		}

		setShowErrorModal((prev) => !prev);
	}

	function addTask(task) {
		const currentTaskList = JSON.parse(localStorage.getItem("tasks"), "[]");
		if (currentTaskList.length >= 10) {
			toggleErrorModal(
				"You can only have 10 tasks at a time. Try completing one then adding more!"
			);
			return;
		}

		tasks.push({
			title: task.title,
			description: task.description,
			id: uuidv4(),
		});
		setTaskList(tasks);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	function editTaskItem(updatedTask, taskId) {
		// Fetch tasks from localstorage
		let fetchedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
		// Find task to be edited
		let editedTask = fetchedTasks.find((task) => task.id === taskId);

		// edit the task with new values
		editedTask.title = updatedTask.title;
		editedTask.description = updatedTask.description;

		// update state and local storage
		localStorage.setItem("tasks", JSON.stringify(fetchedTasks));
		setTaskList(fetchedTasks);
	}

	function handleOnDragEnd(result) {
		// Handles user moving item out of bounds
		if (!result.destination) {
			return;
		}
		// Create copy of existing array
		const tasks = Array.from(taskList);
		// Find item that is being moved and remove it from array
		const [reorderedTask] = tasks.splice(result.source.index, 1);
		// Add item back into array, but at new location
		tasks.splice(result.destination.index, 0, reorderedTask);
		// Update taskList to new one
		setTaskList(tasks);
		// Update in local storage
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	return (
		<>
			{showErrorModal && (
				<ErrorModal
					errorText={errorModalText}
					closeErrorModal={toggleErrorModal}
				/>
			)}
			<div className={styles.listContainer}>
				<h2 className={styles.taskListTitle}>Tasks</h2>
				<hr />
				{showForm ? (
					<TaskForm
						toggleForm={toggleForm}
						addTask={addTask}
						invalidInput={toggleErrorModal}
					/>
				) : (
					<Button
						type={"button"}
						text={"Add a task"}
						class={"addTaskButton"}
						onClick={toggleForm}
					/>
				)}
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId="tasks">
						{(provided) => (
							<ul
								className={styles.list}
								{...provided.droppableProps}
								ref={provided.innerRef}>
								{taskList.map((task, index) => (
									<TaskItem
										task={task}
										key={task.id}
										index={index}
										taskId={task.id}
										editTaskList={setTaskList}
										editTaskItem={editTaskItem}
									/>
								))}
								{provided.placeholder}
							</ul>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</>
	);
}

export default TaskList;

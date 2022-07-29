import styles from "./TaskList.module.css";

import { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import UserContext from "../../../store/userContext";
import TaskItem from "./TaskItem";
import Button from "../../Shared/UI/Button";
import TaskForm from "./TaskForm";
import ErrorModal from "../../Shared/UI/ErrorModal";

function TaskList() {
	const userCtx = useContext(UserContext);

	const [showForm, setShowForm] = useState(false);
	const [taskList, setTaskList] = useState([]);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorModalText, setErrorModalText] = useState("");

	// WILL HANDLE USER FIRST LOADING WEBSITE
	useEffect(() => {
		if (userCtx.user.isLoggedIn) {
			async function getUserTasks() {
				const response = await fetch(
					`http://localhost:5000/tasks/${userCtx.user.userId}`,
					{
						headers: {
							"Content-type": "application/json",
						},
					}
				);

				const userTasks = await response.json();
				if (userTasks.tasks) {
					setTaskList(userTasks.tasks);
				} else {
					// handle error
				}
			}

			getUserTasks();
		} else {
			setTaskList(JSON.parse(localStorage.getItem("tasks") || "[]"));
		}
	}, []);

	// WILL HANDLE USER LOGGING IN/ LOGGING OUT
	useEffect(() => {
		if (userCtx.user.isLoggedIn) {
			async function getUserTasks() {
				const response = await fetch(
					`http://localhost:5000/tasks/${userCtx.user.userId}`,
					{
						headers: {
							"Content-type": "application/json",
						},
					}
				);

				const userTasks = await response.json();
				if (userTasks.tasks) {
					setTaskList(userTasks.tasks);
				} else {
					// handle error
				}
			}

			getUserTasks();
		} else {
			setTaskList(JSON.parse(localStorage.getItem("tasks") || "[]"));
		}
	}, [userCtx.user.isLoggedIn]);

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

	async function addTask(task) {
		// ensure task list has less than 10 tasks, if it doesn't alert user
		if (taskList.length >= 10) {
			toggleErrorModal(
				"You can only have 10 tasks at a time. Try completing one then adding more!"
			);
			return;
		}

		if (userCtx.user.isLoggedIn) {
			// post req to backend to fetch users tasks
			const response = await fetch(
				"http://localhost:5000/tasks/addTask",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ task, userId: userCtx.user.userId }),
				}
			);

			// backend sends back the newly created task
			const newTaskObj = await response.json();
			const newTask = newTaskObj.createdTask;
			// add task to arr
			let updatedList = taskList;
			updatedList.push(newTask);
			// use spread operator into new array to trigger page re-render
			setTaskList([...updatedList]);
		} else {
			let currentTaskList = JSON.parse(
				localStorage.getItem("tasks"),
				"[]"
			);

			currentTaskList.push({
				title: task.title,
				description: task.description,
				id: uuidv4(),
			});
			setTaskList(currentTaskList);
			localStorage.setItem("tasks", JSON.stringify(currentTaskList));
		}
	}

	async function editTaskItem(updatedTask, taskId) {
		if (userCtx.user.isLoggedIn) {
			// patch req to back end
			const response = await fetch(
				"http://localhost:5000/tasks/editTask",
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						updatedTask,
						taskId,
						userId: userCtx.user.userId,
					}),
				}
			);

			const updatedTaskObj = await response.json();
			const editedTask = updatedTaskObj.updatedTask;

			let curList = taskList;
			let foundTask = curList.find((task) => task.id === taskId);
			foundTask.title = editedTask.title;
			foundTask.description = editedTask.description;

			setTaskList([...curList]);
		} else {
			// Fetch tasks from localstorage
			let fetchedTasks = JSON.parse(
				localStorage.getItem("tasks") || "[]"
			);
			// Find task to be edited
			let editedTask = fetchedTasks.find((task) => task.id === taskId);

			// edit the task with new values
			editedTask.title = updatedTask.title;
			editedTask.description = updatedTask.description;

			// update state and local storage
			localStorage.setItem("tasks", JSON.stringify(fetchedTasks));
			setTaskList(fetchedTasks);
		}
	}

	async function deleteTask(taskId) {
		if (userCtx.user.isLoggedIn) {
			const response = await fetch(
				`http://localhost:5000/tasks/deleteTask/${userCtx.user.userId}/${taskId}`,
				{
					method: "DELETE",
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			console.log(response);
			if (response.ok) {
				let curList = taskList;
				curList = curList.filter((task) => task.id !== taskId);

				setTaskList([...curList]);
			}
		} else {
			// Task list for the user
			let tasks = JSON.parse(localStorage.getItem("tasks"));

			// Remove task with specified task id
			tasks = tasks.filter((task) => task.id !== taskId);
			// Update array in local storage
			localStorage.setItem("tasks", JSON.stringify(tasks));
			// Set task list to new task list
			setTaskList(tasks);
		}
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
		// Update in local storage if user doesn't have account
		if (userCtx.isLoggedIn) {
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
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
										deleteTaskItem={deleteTask}
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

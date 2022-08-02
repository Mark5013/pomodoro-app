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

	useEffect(() => {
		if (userCtx.user.isLoggedIn) {
			async function getUserTasks() {
				let response;
				let userTasks;
				// try to fetch users tasks
				try {
					response = await fetch(
						`http://localhost:5000/tasks/${userCtx.user.userId}`,
						{
							headers: {
								"Content-type": "application/json",
							},
						}
					);

					// read response and parse it into object
					userTasks = await response.json();
				} catch (err) {
					// if there is an error set task list to empty and notify user
					console.log(err);
					setTaskList([]);
					toggleErrorModal("Failed to fetch tasks!");
				}

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
	}, [userCtx.user.isLoggedIn, userCtx.user.userId]);

	// toggles the form
	function toggleForm() {
		setShowForm((prev) => !prev);
	}

	// toggles the error modal and allows you to set error modal text
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
			let response;
			let newTaskObj;
			let newTask;
			try {
				// post req to backend to fetch users tasks
				response = await fetch("http://localhost:5000/tasks/addTask", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ task, userId: userCtx.user.userId }),
				});

				// backend sends back the newly created task
				newTaskObj = await response.json();
				newTask = newTaskObj.createdTask;
			} catch (err) {
				toggleErrorModal("Failed to create task");
			}

			// only push to task list if there is a new task
			if (newTask) {
				// add task to arr
				let updatedList = taskList;
				updatedList.push(newTask);
				// use spread operator into new array to trigger page re-render
				setTaskList([...updatedList]);
			}
		} else {
			// use local storage is user isn't logged in
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
			let response;
			let updatedTaskObj;
			let editedTask;

			// patch req to back end
			try {
				response = await fetch("http://localhost:5000/tasks/editTask", {
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						updatedTask,
						taskId,
						userId: userCtx.user.userId,
					}),
				});

				// parse reponse and get the newly edited task
				updatedTaskObj = await response.json();
				editedTask = updatedTaskObj.updatedTask;
			} catch (err) {
				toggleErrorModal("Failed to edit the task, try again later!");
			}

			// if edited task exists, find the old task in the list and update it
			if (editedTask) {
				let curList = taskList;
				let foundTask = curList.find((task) => task.id === taskId);
				foundTask.title = editedTask.title;
				foundTask.description = editedTask.description;

				// use spread operator so the page re-renders
				setTaskList([...curList]);
			}
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
			let response;
			// send delete request to backend
			try {
				response = await fetch(
					`http://localhost:5000/tasks/deleteTask/${userCtx.user.userId}/${taskId}`,
					{
						method: "DELETE",
						headers: {
							"Content-type": "application/json",
						},
					}
				);
			} catch (err) {
				// if error, toggle the error modal
				toggleErrorModal("Failed to delete task, try again later!");
			}

			// if response is ok, find task in current list and delete it, and re render page
			if (response.ok) {
				let curList = taskList;
				curList = curList.filter((task) => task.id !== taskId);

				setTaskList([...curList]);
			} else {
				// if error, toggle the error modal
				toggleErrorModal("Failed to delete task, try again later!");
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

import styles from "./TaskList.module.css";
import useHttpRequest from "../../../hooks/use-HttpRequest";
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
	const sendRequest = useHttpRequest();
	const [showForm, setShowForm] = useState(false);
	const [taskList, setTaskList] = useState([]);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorModalText, setErrorModalText] = useState("");

	useEffect(() => {
		// if user is logged in, use database, else use local storage
		if (userCtx.user.isLoggedIn) {
			async function getUserTasks() {
				// fetch user tasks from database
				const userTasks = await sendRequest(
					`http://localhost:5000/tasks/${userCtx.user.userId}`,
					"GET",
					{ "Content-type": "application/json" }
				);

				// if response is valud, set users tasks to response, else empty array
				if (userTasks) {
					setTaskList(userTasks.tasks);
				} else {
					setTaskList([]);
					toggleErrorModal("Failed to fetch tasks!");
				}
			}

			getUserTasks();
		} else {
			// get from local storage
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

	// add a task
	async function addTask(task) {
		// ensure task list has less than 10 tasks, if it doesn't alert user
		if (taskList.length >= 10) {
			toggleErrorModal(
				"You can only have 10 tasks at a time. Try completing one then adding more!"
			);
			return;
		}

		// use database if user is logged in, else use local storage
		if (userCtx.user.isLoggedIn) {
			// get reponse from backend
			const response = await sendRequest(
				"http://localhost:5000/tasks/addTask",
				"POST",
				{ "Content-type": "application/json" },
				JSON.stringify({ task, userId: userCtx.user.userId })
			);

			// extract new task sent back from backend
			const newTask = response.createdTask;

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

	// edit a task
	async function editTaskItem(updatedTask, taskId) {
		if (userCtx.user.isLoggedIn) {
			// response from backend with updated task
			const response = await sendRequest(
				"http://localhost:5000/tasks/editTask",
				"PATCH",
				{ "Content-type": "application/json" },
				JSON.stringify({
					updatedTask,
					taskId,
					userId: userCtx.user.userId,
				})
			);

			// extract editedTask from response
			const editedTask = response.updatedTask;

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

	// delete a task
	async function deleteTask(taskId) {
		// if user is logged in user database, else use localstorage
		if (userCtx.user.isLoggedIn) {
			// send delete request to backend
			const response = await sendRequest(
				`http://localhost:5000/tasks/deleteTask/${userCtx.user.userId}/${taskId}`,
				"DELETE",
				{ "Content-type": "application/json" }
			);

			// if response is ok, find task in current list and delete it, and re render page
			if (response) {
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

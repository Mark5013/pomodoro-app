import styles from "./TaskForm.module.css";

import Input from "../../Shared/UI/Input";
import GeneralCard from "../../Shared/UI/GeneralCard";
import Button from "../../Shared/UI/Button";
import { useState } from "react";

function TaskForm(props) {
	const [titleText, setTitleText] = useState("");
	const [descriptionText, setDescriptionText] = useState("");

	function titleChangeHandler(event) {
		setTitleText(event.target.value);
	}

	function descriptionChangeHandler(event) {
		setDescriptionText(event.target.value);
	}

	function submitTaskForm(event) {
		event.preventDefault();
		// TODO form validation checks
		console.log(titleText);
		console.log(descriptionText);
		props.addTask({ title: titleText, description: descriptionText, id: "implementlater"});
		props.toggleForm();
	}

	return (
		<GeneralCard cardType="mediumCard">
			<form>
				<div className={styles.taskInputs}>
					<Input
						type="text"
						id="title"
						value={titleText}
						onChange={titleChangeHandler}
						placeholder="Title"
					/>
					<textarea
						className={styles.description}
						rows="3"
						cols="60"
						value={descriptionText}
						onChange={descriptionChangeHandler}
						placeholder="Description (optional)"
					/>
				</div>
				<div className={styles.buttons}>
					<Button
						type="button"
						text="Close"
						style="taskFormButton"
						onClick={props.toggleForm}
					/>
					<Button
						type="submit"
						text="Submit"
						style="taskFormButton"
						onClick={submitTaskForm}
					/>
				</div>
			</form>
		</GeneralCard>
	);
}

export default TaskForm;

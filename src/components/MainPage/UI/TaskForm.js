import styles from "./TaskForm.module.css";
import { v4 as uuidv4 } from "uuid";
import Input from "../../Shared/UI/Input";
import GeneralCard from "../../Shared/UI/GeneralCard";
import Button from "../../Shared/UI/Button";
import { useState } from "react";

function TaskForm(props) {
	const [titleText, setTitleText] = useState(props.titleText || "");
	const [descriptionText, setDescriptionText] = useState(
		props.descriptionText || ""
	);

	function titleChangeHandler(event) {
		setTitleText(event.target.value);
	}

	function descriptionChangeHandler(event) {
		setDescriptionText(event.target.value);
	}

	function submitTaskForm(event) {
		event.preventDefault();
		// TODO form validation checks
		props.addTask({
			title: titleText,
			description: descriptionText,
			id: uuidv4(),
		});
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
						placeholder={props.titleText ? null : "Title"}
					/>
					<textarea
						className={styles.description}
						rows="3"
						cols="60"
						value={descriptionText}
						onChange={descriptionChangeHandler}
						placeholder={
							props.descriptionText
								? null
								: "Description (optional)"
						}
					/>
				</div>
				<div className={styles.buttons}>
					<Button
						type="button"
						text="Close"
						class="taskFormButton"
						onClick={props.toggleForm}
					/>
					<Button
						type="submit"
						text="Submit"
						class="taskFormButton"
						onClick={submitTaskForm}
					/>
				</div>
			</form>
		</GeneralCard>
	);
}

export default TaskForm;

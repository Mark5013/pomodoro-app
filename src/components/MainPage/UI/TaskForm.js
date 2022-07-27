import styles from "./TaskForm.module.css";
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
		if (titleText.trim().length === 0) {
			props.invalidInput("Title field is required to be filled out");
			return;
		}

		props.addTask({
			title: titleText,
			description: descriptionText,
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
						onChange={titleChangeHandler}
						placeholder={props.titleText ? undefined : "Title"}
						value={titleText}
					/>
					<textarea
						className={styles.description}
						rows="3"
						cols="60"
						value={descriptionText}
						onChange={descriptionChangeHandler}
						placeholder={
							props.descriptionText
								? ""
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

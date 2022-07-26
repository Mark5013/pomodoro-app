import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TaskForm from "../../MainPage/UI/TaskForm";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

export default function LongMenu(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (event) => {
		// Edit or Delete button clicked, or null value if menu is clicked off of
		const action = event.nativeEvent.target.outerText;
		// Task id if a task was clicked on
		const taskId = props.taskId;
		// Task list for the user
		let tasks = JSON.parse(localStorage.getItem("tasks"));

		if (action === "Edit") {
			props.editTaskItem(props.taskId);
		} else if (action === "Delete") {
			// Remove task with specified task id
			tasks = tasks.filter((task) => task.id !== taskId);
			// Update array in local storage
			localStorage.setItem("tasks", JSON.stringify(tasks));
			// Set task list to new task list
			props.editTaskList(tasks);
		}

		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				aria-label="more"
				id="long-button"
				aria-controls={open ? "long-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="long-menu"
				MenuListProps={{
					"aria-labelledby": "long-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
						width: "20ch",
					},
				}}>
				{options.map((option) => (
					<MenuItem key={option} onClick={handleClose}>
						{option}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

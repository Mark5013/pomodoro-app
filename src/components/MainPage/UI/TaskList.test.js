import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "./TaskList";

describe("TaskList Component", () => {
	test("Renders list with 0 items initially", () => {
		render(<TaskList />);

		const taskList = screen.queryAllByRole("li");

		expect(taskList).toHaveLength(0);
	});

	test("Renders form when clicking add task button", () => {
		render(<TaskList />);

		const addBtn = screen.getByText("Add a task");
		userEvent.click(addBtn);

		const titleInput = screen.getByPlaceholderText("Title");
		expect(titleInput).toBeInTheDocument();
	});

	test("Adds task to task list after submitting form", () => {
		render(<TaskList />);

		// click on add task btn
		const addBtn = screen.getByText("Add a task");
		userEvent.click(addBtn);

		// enter in a title
		const titleInput = screen.getByPlaceholderText("Title");
		userEvent.type(titleInput, "Super Cool task");

		// click on submit btn
		const submitBtn = screen.getByText("Submit");
		userEvent.click(submitBtn);

		// check that task is rendered on screen
		expect(screen.getByText("Super Cool task")).toBeInTheDocument();
	});
});

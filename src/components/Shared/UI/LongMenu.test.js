import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LongMenu from "./LongMenu";

describe("LongMenu Component", () => {
	test("doesn't render drop down menu without click", () => {
		// render menu
		render(<LongMenu />);

		// search for menu items in drop down menu
		const menuItems = screen.queryAllByTestId("menu-item");

		// ensure its not there
		expect(menuItems).toHaveLength(0);
	});

	test("renders drop down menu with click", () => {
		// render menu
		render(<LongMenu />);

		// get menu btn and click it
		const menuBtn = screen.getByRole("button");
		userEvent.click(menuBtn);

		// ensure that drop down items are being rendered
		const menuItems = screen.queryAllByTestId("menu-item");
		expect(menuItems).toHaveLength(2);
	});
});

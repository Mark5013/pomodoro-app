import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContextProvider } from "../../../store/userContext";
import Header from "./Header";

describe("Header Component", () => {
	test("renders login button when user not logged", () => {
		// render header component
		render(
			<GoogleOAuthProvider clientId="335211572347-2538r3ir2c51hh0o6p2kqm97b6jem5vh.apps.googleusercontent.com">
				<Header />
			</GoogleOAuthProvider>,
			{ wrapper: HashRouter, UserContextProvider }
		);

		// get login button from screen
		const button = screen.getByText("Log in");

		// ensure button is in document
		expect(button).toBeInTheDocument();
	});

	test("doesn't render profile menu when user not logged in", () => {
		// render header component
		render(
			<GoogleOAuthProvider clientId="335211572347-2538r3ir2c51hh0o6p2kqm97b6jem5vh.apps.googleusercontent.com">
				<Header />
			</GoogleOAuthProvider>,
			{ wrapper: HashRouter, UserContextProvider }
		);

		// query for profile menu
		const profileMenu = screen.queryByAltText("profile pic");

		// ensure profile menu is null (not found)
		expect(profileMenu).toBeNull();
	});
});

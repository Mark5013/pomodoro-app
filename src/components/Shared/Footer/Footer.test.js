import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
	test("Renders github icon", () => {
		//render component
		render(<Footer />);

		// get icon
		const gitHubIcon = screen.getByTestId("github-icon");

		// expect its in document
		expect(gitHubIcon).toBeInTheDocument();
	});

	test("Renders linkedin icon", () => {
		//render component
		render(<Footer />);

		// get icon
		const linkedInIcon = screen.getByTestId("linkedin-icon");

		// expect its in document
		expect(linkedInIcon).toBeInTheDocument();
	});
});

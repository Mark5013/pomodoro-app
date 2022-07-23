import { useState, createContext } from "react";

const ModeContext = createContext({
	mode: "",
	switchMode: (newMode) => {},
});

export const ModeContextProvider = (props) => {
	const [mode, setMode] = useState("pomodoro");

	const switchModeHandler = (newMode) => {
		setMode(newMode);
	};

	const ModeContextValue = {
		mode,
		switchMode: switchModeHandler,
	};

	return (
		<ModeContext.Provider value={ModeContextValue}>
			{props.children}
		</ModeContext.Provider>
	);
};

export default ModeContext;

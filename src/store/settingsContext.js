import { useState, createContext, useEffect, useContext } from "react";
import UserContext from "./userContext";

const SettingsContext = createContext({
	shortBreakLength: "",
	longBreakLength: "",
	pomodoroModeLength: "",
	changePomodoroLength: () => {},
	changeShortBreakLength: () => {},
	changeLongBreakLength: () => {},
});

export const SettingsContextProvider = (props) => {
	const userCtx = useContext(UserContext);
	const [shortBreakLength, setShortBreakLength] = useState("05");
	const [longBreakLength, setLongBreakLength] = useState("15");
	const [pomodoroModeLength, setPomodoroModeLength] = useState("25");

	useEffect(() => {
		if (!userCtx.user.isLoggedIn) {
			setShortBreakLength("05");
			setLongBreakLength("15");
			setPomodoroModeLength("25");
		}
	}, [userCtx.user.isLoggedIn]);

	const switchShortBreakLength = (newLength) => {
		setShortBreakLength(newLength);
	};

	const switchLongBreakLength = (newLength) => {
		setLongBreakLength(newLength);
	};

	const switchPomodoroModeLength = (newLength) => {
		console.log(newLength);
		setPomodoroModeLength(newLength);
	};

	const SettingsContextValue = {
		shortBreakLength,
		longBreakLength,
		pomodoroModeLength,
		changeShortBreakLength: switchShortBreakLength,
		changeLongBreakLength: switchLongBreakLength,
		changePomodoroLength: switchPomodoroModeLength,
	};

	return (
		<SettingsContext.Provider value={SettingsContextValue}>
			{props.children}
		</SettingsContext.Provider>
	);
};

export default SettingsContext;

import styles from "./TimerLengthSettings.module.css";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import SettingsContext from "../../../store/settingsContext";
import UserContext from "../../../store/userContext";

function TimerLengthSettings() {
	const settingsCtx = useContext(SettingsContext);
	const userCtx = useContext(UserContext);

	const [pomodoroModeLength, setPomodoroModeLength] = useState("25");
	const [shortBreakLength, setShortBreakLength] = useState("05");
	const [longBreakLength, setLongBreakLength] = useState("15");

	useEffect(() => {
		setPomodoroModeLength(settingsCtx.pomodoroModeLength);
		setShortBreakLength(settingsCtx.shortBreakLength);
		setLongBreakLength(settingsCtx.longBreakLength);
	}, [settingsCtx]);

	const handlePomodoroChange = async (event) => {
		const newLength = event.target.value;
		let response;
		let user;
		try {
			response = await fetch(
				"http://localhost:5000/settings/updatePomodoroLength",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						newLength,
						uid: userCtx.user.userId,
					}),
				}
			);
			user = await response.json();
			console.log(user);
		} catch (err) {}
		settingsCtx.changePomodoroLength(newLength);
	};

	const handleShortBreakChange = async (event) => {
		const newLength = event.target.value;
		let response;
		let user;
		try {
			response = await fetch(
				"http://localhost:5000/settings/updateShortBreakLength",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						newLength,
						uid: userCtx.user.userId,
					}),
				}
			);
			user = await response.json();
			console.log(user);
		} catch (err) {}
		settingsCtx.changeShortBreakLength(newLength);
	};

	const handleLongBreakChange = async (event) => {
		const newLength = event.target.value;
		let response;
		let user;
		try {
			response = await fetch(
				"http://localhost:5000/settings/updateLongBreakLength",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						newLength,
						uid: userCtx.user.userId,
					}),
				}
			);
			user = await response.json();
			console.log(user);
		} catch (err) {}
		settingsCtx.changeLongBreakLength(newLength);
	};

	return (
		<>
			<div className={styles.input}>
				<p>Pomodoro timer length:</p>
				<FormControl size="small">
					<InputLabel id="pomodoro-select-label">Length</InputLabel>
					<Select
						labelId="pomodoro-select-label"
						id="pomodoro-select"
						value={pomodoroModeLength}
						label="pomodoro-mode-length"
						onChange={handlePomodoroChange}>
						<MenuItem value={"05"}>5</MenuItem>
						<MenuItem value={"10"}>10</MenuItem>
						<MenuItem value={"15"}>15</MenuItem>
						<MenuItem value={"20"}>20</MenuItem>
						<MenuItem value={"25"}>25</MenuItem>
						<MenuItem value={"30"}>30</MenuItem>
						<MenuItem value={"35"}>35</MenuItem>
						<MenuItem value={"40"}>40</MenuItem>
						<MenuItem value={"45"}>45</MenuItem>
						<MenuItem value={"50"}>50</MenuItem>
						<MenuItem value={"55"}>55</MenuItem>
						<MenuItem value={"60"}>60</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div className={styles.input}>
				<p>Short-break timer length:</p>
				<FormControl size="small">
					<InputLabel id="short-break-select-label">
						Length
					</InputLabel>
					<Select
						labelId="short-break-select-label"
						id="short-break-select"
						value={shortBreakLength}
						label="short-break-mode-length"
						onChange={handleShortBreakChange}>
						<MenuItem value={"05"}>5</MenuItem>
						<MenuItem value={"10"}>10</MenuItem>
						<MenuItem value={"15"}>15</MenuItem>
						<MenuItem value={"20"}>20</MenuItem>
						<MenuItem value={"25"}>25</MenuItem>
						<MenuItem value={"30"}>30</MenuItem>
						<MenuItem value={"35"}>35</MenuItem>
						<MenuItem value={"40"}>40</MenuItem>
						<MenuItem value={"45"}>45</MenuItem>
						<MenuItem value={"50"}>50</MenuItem>
						<MenuItem value={"55"}>55</MenuItem>
						<MenuItem value={"60"}>60</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div className={styles.input}>
				<p>Long-break timer length:</p>
				<FormControl size="small">
					<InputLabel id="long-break-select-label">Length</InputLabel>
					<Select
						labelId="long-break-select-label"
						id="long-break-select"
						value={longBreakLength}
						label="long-break-length"
						onChange={handleLongBreakChange}>
						<MenuItem value={"05"}>5</MenuItem>
						<MenuItem value={"10"}>10</MenuItem>
						<MenuItem value={"15"}>15</MenuItem>
						<MenuItem value={"20"}>20</MenuItem>
						<MenuItem value={"25"}>25</MenuItem>
						<MenuItem value={"30"}>30</MenuItem>
						<MenuItem value={"35"}>35</MenuItem>
						<MenuItem value={"40"}>40</MenuItem>
						<MenuItem value={"45"}>45</MenuItem>
						<MenuItem value={"50"}>50</MenuItem>
						<MenuItem value={"55"}>55</MenuItem>
						<MenuItem value={"60"}>60</MenuItem>
					</Select>
				</FormControl>
			</div>
		</>
	);
}

export default TimerLengthSettings;

import { useEffect, useState } from "react";

import Header from "../Shared/Header/Header";
import TimerCard from "./UI/TimerCard";
import Button from "../Shared/UI/Button";

let interval;

function MainPage() {
	const [minutes, setMinutes] = useState("25");
	const [seconds, setSeconds] = useState("00");

	// controls timer displays on screen
	function startTimer() {
		// convert minutes and seconds to milliseconds
		let timerLength = Number(minutes) * 60000 + Number(seconds) * 1000;
		console.log(timerLength);

		interval = setInterval(() => {
			// decrement timer length by 1 second every second
			timerLength -= 1000;
			// if timerLength hits 0, clear the intervals
			if (timerLength <= 0) {
				clearInterval(interval);
			}
			setMinutes(
				String(
					Math.floor((timerLength % (1000 * 60 * 60)) / (1000 * 60))
				).padStart(2, "0")
			);
			setSeconds(
				String(Math.floor((timerLength % (1000 * 60)) / 1000)).padStart(
					2,
					"0"
				)
			);
		}, 1000);
	}

	function clearTimer() {
		clearInterval(interval);
	}

	return (
		<>
			<Header />
			<TimerCard timerRunning={true} minutes={minutes} seconds={seconds}>
				<Button text="Start Timer" type="button" onClick={startTimer} />
				<Button text="Pause Timer" type="button" onClick={clearTimer} />
			</TimerCard>
		</>
	);
}

export default MainPage;

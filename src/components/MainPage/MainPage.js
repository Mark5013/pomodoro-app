import { useEffect, useState } from "react";

import Header from "../Shared/Header/Header";
import TimerCard from "./UI/TimerCard";
import Button from "../Shared/UI/Button";

let interval;

function MainPage() {
	const [minutes, setMinutes] = useState("25");
	const [seconds, setSeconds] = useState("00");

	function startTimer() {
		let timerLength = Number(minutes) * 60000 + Number(seconds) * 1000;
		console.log(timerLength);

		interval = setInterval(() => {
			timerLength -= 1000;
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

	return (
		<>
			<Header />
			<TimerCard timerRunning={true} minutes={minutes} seconds={seconds}>
				<Button text="Start Timer" type="button" onClick={startTimer} />
			</TimerCard>
		</>
	);
}

export default MainPage;

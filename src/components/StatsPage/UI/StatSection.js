import styles from "./StatSection.module.css";
import { useEffect, useState } from "react";
import Column from "./Column";
import { v4 as uuidv4 } from "uuid";
import Button from "../../Shared/UI/Button";

function StatSection() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	console.log("reredner");

	function getFullWeek() {
		const curWeek = [];
		for (let i = currentDate.getDay(); i >= 0; i--) {
			let day = new Date(currentDate);
			day.setDate(day.getDate() - i);
			curWeek.push(day.toISOString().split("T")[0]);
		}

		for (let i = 1; i <= 6 - currentDate.getDay(); ++i) {
			let day = new Date(currentDate);
			day.setDate(day.getDate() + i);
			curWeek.push(day.toISOString().split("T")[0]);
		}
		setDaysOfWeek([...curWeek]);
	}

	function nextWeek() {
		let newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + 7);
		setCurrentDate(newDate);
	}

	function prevWeek() {
		let newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() - 7);
		setCurrentDate(newDate);
	}

	useEffect(() => {
		getFullWeek();
	}, [currentDate]);

	return (
		<>
			<Button text="prevweek" onClick={prevWeek} />
			<div className={styles.gridSection}>
				{daysOfWeek.map((date) => (
					<Column curDate={date} key={uuidv4()} />
				))}
			</div>
			<Button text="nextweek" onClick={nextWeek} />
		</>
	);
}

export default StatSection;

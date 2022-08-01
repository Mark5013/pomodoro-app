import styles from "./StatSection.module.css";
import { useEffect, useState, useContext } from "react";
import UserContext from "../../../store/userContext";
import Column from "./Column";
import { v4 as uuidv4 } from "uuid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { IconButton } from "@mui/material";

function StatSection() {
	const userCtx = useContext(UserContext);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const [monthlyTime, setMonthlyTime] = useState(0);
	const [yearlyTime, setYearlyTime] = useState(0);
	const [weeklyTime, setWeeklyTime] = useState(0);

	console.log("reredner");

	function toIsoString(date) {
		var tzo = -date.getTimezoneOffset(),
			dif = tzo >= 0 ? "+" : "-",
			pad = function (num) {
				return (num < 10 ? "0" : "") + num;
			};

		return (
			date.getFullYear() +
			"-" +
			pad(date.getMonth() + 1) +
			"-" +
			pad(date.getDate()) +
			"T" +
			pad(date.getHours()) +
			":" +
			pad(date.getMinutes()) +
			":" +
			pad(date.getSeconds()) +
			dif +
			pad(Math.floor(Math.abs(tzo) / 60)) +
			":" +
			pad(Math.abs(tzo) % 60)
		);
	}

	function getFullWeek() {
		const curWeek = [];
		for (let i = currentDate.getDay(); i >= 0; i--) {
			let day = new Date(currentDate);
			day.setDate(day.getDate() - i);
			curWeek.push(toIsoString(day).split("T")[0]);
		}

		for (let i = 1; i <= 6 - currentDate.getDay(); ++i) {
			let day = new Date(currentDate);
			day.setDate(day.getDate() + i);
			curWeek.push(toIsoString(day).split("T")[0]);
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

	useEffect(() => {
		async function getMonthlyTime() {
			console.log(currentDate.getMonth() + 1);
			const response = await fetch(
				`http://localhost:5000/stats/getMonthsMinutes/${
					userCtx.user.userId
				}/${currentDate.getMonth() + 1}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const monthlyTime = await response.json();
			setMonthlyTime(monthlyTime.monthlyTime);
		}
		if (userCtx.user.isLoggedIn) {
			getMonthlyTime();
		}
	}, [userCtx.user.isLoggedIn]);

	useEffect(() => {
		async function getMonthlyTime() {
			const response = await fetch(
				`http://localhost:5000/stats/getMonthsMinutes/${
					userCtx.user.userId
				}/${currentDate.getMonth() + 1}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const monthlyTime = await response.json();
			setMonthlyTime(monthlyTime.monthlyTime);
		}
		getMonthlyTime();
	}, [currentDate]);

	useEffect(() => {
		async function getYearlyTime() {
			const response = await fetch(
				`http://localhost:5000/stats/getYearsMinutes/${
					userCtx.user.userId
				}/${currentDate.getYear() + 1900}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const yearlyTime = await response.json();
			setYearlyTime(yearlyTime.yearlyTime);
		}
		if (userCtx.user.isLoggedIn) {
			getYearlyTime();
		}
	}, [userCtx.user.isLoggedIn]);

	useEffect(() => {
		async function getYearlyTime() {
			const response = await fetch(
				`http://localhost:5000/stats/getYearsMinutes/${
					userCtx.user.userId
				}/${currentDate.getYear() + 1900}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const yearlyTime = await response.json();
			setYearlyTime(yearlyTime.yearlyTime);
		}
		getYearlyTime();
	}, [currentDate]);

	return (
		<>
			<div className={styles.statSection}>
				<IconButton onClick={prevWeek}>
					<NavigateBeforeIcon />
				</IconButton>
				<div className={styles.gridSection}>
					{daysOfWeek.map((date) => (
						<Column
							curDate={date}
							key={uuidv4()}
							updateWeeklyTime={setWeeklyTime}
						/>
					))}
				</div>
				<IconButton onClick={nextWeek}>
					<NavigateNextIcon />
				</IconButton>
			</div>
			<div>
				<p>Total time this week: {weeklyTime.toFixed(2)} minutes</p>
				<p>Total time this month: {monthlyTime.toFixed(2)} minutes</p>
				<p>Total time this year: {yearlyTime.toFixed(2)} minutes</p>
			</div>
		</>
	);
}

export default StatSection;

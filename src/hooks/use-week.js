import { useState, useCallback } from "react";
import useHttpRequest from "./use-HttpRequest";

function useWeek() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const [fetchingData, setFetchingData] = useState(false);
	const sendRequest = useHttpRequest();

	// formats dates the way i need them lol
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

	// get minutes spent for a specified date
	async function getMinutesSpent(curDate, user) {
		// only if user is logged in
		// if any errors occur, will return 0
		if (user.isLoggedIn) {
			const minutes = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/stats/getDatesMinutes/${user.userId}/${curDate}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			if (minutes) {
				return minutes.time;
			} else {
				return 0;
			}
		}

		return 0;
	}

	// gets the full week of dates
	const getFullWeek = useCallback(
		async (user) => {
			setFetchingData(true);
			const curWeek = [];
			const weeklyData = [];

			// get all previous days to current day for current week
			for (let i = currentDate.getDay(); i >= 0; i--) {
				let day = new Date(currentDate);
				day.setDate(day.getDate() - i);
				curWeek.push(toIsoString(day).split("T")[0]);
			}

			// get all future days to current day for current week
			for (let i = 1; i <= 6 - currentDate.getDay(); ++i) {
				let day = new Date(currentDate);
				day.setDate(day.getDate() + i);
				curWeek.push(toIsoString(day).split("T")[0]);
			}

			// get time spent in each day for the week
			for (let i = 0; i < curWeek.length; ++i) {
				const time = await getMinutesSpent(curWeek[i], user);
				weeklyData.push({ minutes: time, date: curWeek[i] });
			}

			// set data
			const minutesForWeek = Math.floor(
				weeklyData.reduce((acc, e) => acc + e.minutes, 0)
			);
			setDaysOfWeek([...weeklyData]);
			setFetchingData(false);
			return minutesForWeek;
		},
		[currentDate]
	);

	// gets next week
	function nextWeek() {
		let newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + 7);
		setCurrentDate(newDate);
	}

	// gets previous week
	function prevWeek() {
		let newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() - 7);
		setCurrentDate(newDate);
	}

	return {
		currentDate,
		daysOfWeek,
		getFullWeek,
		nextWeek,
		prevWeek,
		fetchingData,
		setFetchingData,
	};
}

export default useWeek;

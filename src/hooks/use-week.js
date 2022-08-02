import { useState, useCallback } from "react";

function useWeek() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const [fetchingData, setFetchingData] = useState(false);

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

	async function getMinutesSpent(curDate, user) {
		if (user.isLoggedIn) {
			const response = await fetch(
				`http://localhost:5000/stats/getDatesMinutes/${user.userId}/${curDate}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const data = await response.json();

			return data.time;
		}
		return 0;
	}

	const getFullWeek = useCallback(
		async (user) => {
			setFetchingData(true);
			const curWeek = [];
			const weeklyData = [];
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

			for (let i = 0; i < curWeek.length; ++i) {
				const time = await getMinutesSpent(curWeek[i], user);
				weeklyData.push({ minutes: time, date: curWeek[i] });
			}

			const minutesForWeek = Math.floor(
				weeklyData.reduce((acc, e) => acc + e.minutes, 0)
			);
			setDaysOfWeek([...weeklyData]);
			setFetchingData(false);
			return minutesForWeek;
		},
		[currentDate]
	);

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

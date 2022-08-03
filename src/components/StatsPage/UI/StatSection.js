import styles from "./StatSection.module.css";
import { useEffect, useState, useContext } from "react";
import UserContext from "../../../store/userContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { IconButton, CircularProgress } from "@mui/material";
import useWeek from "../../../hooks/use-week";
import SubStatSection from "./SubStatSection";
import { Skeleton, Stack } from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import useHttpRequest from "../../../hooks/use-HttpRequest";

const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec",
];

function StatSection() {
	const userCtx = useContext(UserContext);
	const [monthlyTime, setMonthlyTime] = useState(0);
	const [yearlyTime, setYearlyTime] = useState(0);
	const [weeklyTime, setWeeklyTime] = useState(0);
	const {
		currentDate,
		daysOfWeek,
		getFullWeek,
		nextWeek,
		prevWeek,
		fetchingData,
	} = useWeek();
	const sendRequest = useHttpRequest();

	useEffect(() => {
		async function getUserTime(user) {
			// time for month
			const monthTime = await sendRequest(
				`http://localhost:5000/stats/getMonthsMinutes/${user.userId}/${
					currentDate.getMonth() + 1
				}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			// time for year
			const yearTime = await sendRequest(
				`http://localhost:5000/stats/getYearsMinutes/${user.userId}/${
					currentDate.getYear() + 1900
				}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			// set time to 0 if there is an error
			if (!monthTime) {
				setMonthlyTime(0);
			}

			if (!yearTime) {
				setYearlyTime(0);
			}

			// set monthly and yearly time, round down
			setMonthlyTime(Math.floor(monthTime.monthlyTime) || 0);
			setYearlyTime(Math.floor(yearTime.yearlyTime) || 0);
		}

		// set weekly time
		if (userCtx.user.isLoggedIn) {
			getFullWeek(userCtx.user).then((res) => {
				setWeeklyTime(res);
			});
			getUserTime(userCtx.user);
		}
	}, [currentDate, userCtx.user, getFullWeek, sendRequest]);

	return (
		<>
			{!fetchingData && daysOfWeek.length > 0 ? (
				<div className={styles.page}>
					<IconButton onClick={prevWeek}>
						<NavigateBeforeIcon />
					</IconButton>
					<div className={styles.entireStatSection}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								width={500}
								height={300}
								data={daysOfWeek}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="minutes" fill="#00adb5" />
							</BarChart>
						</ResponsiveContainer>
					</div>

					<IconButton onClick={nextWeek}>
						<NavigateNextIcon />
					</IconButton>
				</div>
			) : (
				<div className={`${styles.page} ${styles.center}`}>
					<CircularProgress
						color="inherit"
						className={styles.loader}
					/>
				</div>
			)}
			<div className={styles.subStats}>
				{!fetchingData && daysOfWeek.length > 0 ? (
					<>
						<SubStatSection
							title="Current Week's Time:"
							type="week"
							body={weeklyTime}
						/>
						<SubStatSection
							title={`${
								monthNames[currentDate.getMonth()]
							}'s Total Time:`}
							monthName={monthNames[currentDate.getMonth()]}
							year={currentDate.getYear() + 1900}
							type="month"
							body={monthlyTime}
						/>
						<SubStatSection
							title={`Total Time In ${
								currentDate.getYear() + 1900
							}`}
							year={currentDate.getYear() + 1900}
							type="year"
							body={yearlyTime}
						/>
					</>
				) : (
					<>
						<Stack spacing={1}>
							<Skeleton
								variant="rectangular"
								width={300}
								height={262}
							/>
							<Skeleton variant="text" />
							<Skeleton variant="text" />
						</Stack>
						<Stack spacing={1}>
							<Skeleton
								variant="rectangular"
								width={300}
								height={262}
							/>
							<Skeleton variant="text" />
							<Skeleton variant="text" />
						</Stack>
						<Stack spacing={1}>
							<Skeleton
								variant="rectangular"
								width={300}
								height={262}
							/>
							<Skeleton variant="text" />
							<Skeleton variant="text" />
						</Stack>
					</>
				)}
			</div>
		</>
	);
}

export default StatSection;

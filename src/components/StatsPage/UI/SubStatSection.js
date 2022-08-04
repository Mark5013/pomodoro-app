import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useContext } from "react";
import UserContext from "../../../store/userContext";
import useHttpRequest from "../../../hooks/use-HttpRequest";

function SubStatSection(props) {
	const [monthName, setMonthName] = useState(props.monthName);
	const [year, setYear] = useState(props.year);
	const [minutes, setMinutes] = useState(props.body);
	const userCtx = useContext(UserContext);
	const sendRequest = useHttpRequest();

	// will update minutes displayed on card when user changes the year, get minutes for specified year/month
	async function handleYearChange(event) {
		if (event.target.value && event.target.value !== year) {
			const newYear = event.target.value;

			// minutes returned
			const minutes = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/stats/getMonthAndYearMinutes/${userCtx.user.userId}/${monthName}/${newYear}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			// if minutes is returned, set minutes to the return value, else set it to 0
			if (minutes.time) {
				setMinutes(Math.floor(minutes.time));
				setYear(newYear);
			} else {
				setMinutes(0);
				setYear(newYear);
			}
		}
	}

	// will update minutes displayed on card when user changes the month, get minutes for specified year/month
	async function handleMonthChange(event) {
		if (event.target.value !== monthName) {
			const newMonth = event.target.value;

			// minutes returned
			const minutes = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/stats/getMonthAndYearMinutes/${userCtx.user.userId}/${newMonth}/${year}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			// if minutes is returned, set minutes to the returned value, else set it to 0
			if (minutes.time) {
				setMinutes(Math.floor(minutes.time));
				setMonthName(newMonth);
			} else {
				setMinutes(0);
				setMonthName(newMonth);
			}
		}
	}

	// will only handle when the year is changed, doesn't care about the month
	async function onlyHandleYearChange(event) {
		if (event.target.value !== year) {
			const newYear = event.target.value;

			// minutes returned
			const minutes = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/stats/getYearsMinutes/${userCtx.user.userId}/${newYear}`,
				"GET",
				{ "Content-type": "application/json" }
			);

			// if minutes is returned, set minutes to the returned value, else set it to 0
			if (minutes.yearlyTime) {
				setMinutes(Math.floor(minutes.yearlyTime));
				setYear(newYear);
			} else {
				setMinutes(0);
				setYear(newYear);
			}
		}
	}

	return (
		<Card sx={{ width: 300, height: 315 }}>
			<CardMedia
				component="img"
				height="140"
				image="https://m.media-amazon.com/images/I/71S7kLF9iLL._SS500_.jpg"
				alt="green iguana"
			/>
			<CardContent>
				<Typography
					gutterBottom
					variant="h5"
					component="div"
					fontFamily="inherit">
					{props.type === "week" && props.title}
					{props.type === "month" &&
						`Total Time in ${monthName}, ${year}`}
					{props.type === "year" && `Total Time In ${year}`}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					fontFamily="inherit"
					fontSize="1.2em">
					{minutes} minutes
				</Typography>
			</CardContent>
			<CardActions>
				{props.type === "month" && (
					<>
						<FormControl sx={{ m: 1, minWidth: 80 }} size="small">
							<InputLabel id="demo-simple-select-autowidth-label">
								Month
							</InputLabel>
							<Select
								labelId="demo-simple-select-autowidth-label"
								id="demo-simple-select-autowidth"
								value={monthName}
								onChange={handleMonthChange}
								autoWidth
								label="Month">
								<MenuItem value={"Jan"}>Jan</MenuItem>
								<MenuItem value={"Feb"}>Feb</MenuItem>
								<MenuItem value={"Mar"}>Mar</MenuItem>
								<MenuItem value={"Apr"}>Apr</MenuItem>
								<MenuItem value={"May"}>May</MenuItem>
								<MenuItem value={"Jun"}>Jun</MenuItem>
								<MenuItem value={"Jul"}>Jul</MenuItem>
								<MenuItem value={"Aug"}>Aug</MenuItem>
								<MenuItem value={"Sept"}>Sept</MenuItem>
								<MenuItem value={"Oct"}>Oct</MenuItem>
								<MenuItem value={"Nov"}>Nov</MenuItem>
								<MenuItem value={"Dec"}>Dec</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ m: 1, minWidth: 80 }} size="small">
							<InputLabel id="demo-simple-select-autowidth-label">
								Year
							</InputLabel>
							<Select
								labelId="demo-simple-select-autowidth-label"
								id="demo-simple-select-autowidth"
								value={year}
								onChange={handleYearChange}
								autoWidth
								label="Year">
								<MenuItem value={"2022"}>2022</MenuItem>
								<MenuItem value={"2023"}>2023</MenuItem>
								<MenuItem value={"2024"}>2024</MenuItem>
							</Select>
						</FormControl>
					</>
				)}
				{props.type === "year" && (
					<FormControl sx={{ m: 1, minWidth: 80 }} size="small">
						<InputLabel id="demo-simple-select-autowidth-label">
							Year
						</InputLabel>
						<Select
							labelId="demo-simple-select-autowidth-label"
							id="demo-simple-select-autowidth"
							value={year}
							onChange={onlyHandleYearChange}
							autoWidth
							label="Year">
							<MenuItem value={"2022"}>2022</MenuItem>
							<MenuItem value={"2023"}>2023</MenuItem>
							<MenuItem value={"2024"}>2024</MenuItem>
						</Select>
					</FormControl>
				)}
			</CardActions>
		</Card>
	);
}

export default SubStatSection;

import { useEffect, useContext, useState } from "react";
import styles from "./Column.module.css";
import UserContext from "../../../store/userContext";

function Column(props) {
	const userCtx = useContext(UserContext);

	const [minutes, setMinutes] = useState(0);

	useEffect(() => {
		async function getMinutesSpent() {
			const response = await fetch(
				`http://localhost:5000/stats/getDatesMinutes/${userCtx.user.userId}/${props.curDate}`,
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			const data = await response.json();

			if (data) {
				setMinutes(data.time);
			}
		}

		if (userCtx.user.isLoggedIn) {
			getMinutesSpent();
		}
	}, [props.curDate, userCtx.user.userId]);

	return (
		<div className={styles.col}>
			<div className={styles.bar}>
				<div
					className={styles.height}
					style={{ height: `${minutes}px` }}></div>
			</div>
			<p>{minutes.toFixed(2)} min</p>
			<p>{props.curDate}</p>
		</div>
	);
}

export default Column;

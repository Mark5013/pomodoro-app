import styles from "./TimerCard.module.css";
import { useContext } from "react";
import ModeContext from "../../../store/modeContext";

function TimerCard(props) {
	const modeCtx = useContext(ModeContext);

	return (
		<div className={`${styles.card} ${styles[modeCtx.mode]}`}>
			<div className={styles.children}>{props.children}</div>
		</div>
	);
}

export default TimerCard;

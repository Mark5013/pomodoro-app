import styles from "./SettingsPage.module.css";
import { useContext } from "react";
import SettingsContext from "../../store/settingsContext";
import Header from "../Shared/Header/Header";
import Footer from "../Shared/Footer/Footer";
import TimerLengthSettings from "./UI/TimerLengthSettings";

function SettingsPage() {
	const settingsCtx = useContext(SettingsContext);

	return (
		<>
			<div className={styles.headerBackground}>
				<Header />
			</div>
			<div className={styles.settingsSection}>
				<TimerLengthSettings />
			</div>
			<Footer />
		</>
	);
}

export default SettingsPage;

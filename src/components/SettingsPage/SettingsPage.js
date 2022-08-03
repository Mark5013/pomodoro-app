import styles from "./SettingsPage.module.css";
import Header from "../Shared/Header/Header";
import Footer from "../Shared/Footer/Footer";
import TimerLengthSettings from "./UI/TimerLengthSettings";
import { Helmet } from "react-helmet";

function SettingsPage() {
	return (
		<>
			<Helmet>
				<title>PomoTracker</title>
			</Helmet>
			<div className={styles.headerBackground}>
				<Header />
			</div>
			<div className={styles.settingsSection}>
				<h2>Timer Settings:</h2>
				<TimerLengthSettings />
			</div>
			<Footer />
		</>
	);
}

export default SettingsPage;

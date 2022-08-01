import Header from "../Shared/Header/Header";
import styles from "./StatsPage.module.css";
import StatSection from "./UI/StatSection";

function StatsPage() {
	return (
		<div className={styles.background}>
			<div className={styles.headerBackground}>
				<Header />
			</div>
			<div className={styles.statSection}>
				<StatSection />
			</div>
		</div>
	);
}

export default StatsPage;

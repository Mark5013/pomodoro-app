import Footer from "../Shared/Footer/Footer";
import Header from "../Shared/Header/Header";
import styles from "./StatsPage.module.css";
import StatSection from "./UI/StatSection";

function StatsPage() {
	return (
		<div className={styles.background}>
			<div className={styles.headerBackground}>
				<Header />
			</div>
			<StatSection />
			<Footer />
		</div>
	);
}

export default StatsPage;

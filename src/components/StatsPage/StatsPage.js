import Footer from "../Shared/Footer/Footer";
import Header from "../Shared/Header/Header";
import styles from "./StatsPage.module.css";
import StatSection from "./UI/StatSection";
import UserContext from "../../store/userContext";
import { useContext } from "react";
import { Helmet } from "react-helmet";

function StatsPage() {
	const userCtx = useContext(UserContext);

	return (
		<>
			<Helmet>
				<title>{userCtx.user.name} - PomoTracker</title>
			</Helmet>
			<div className={styles.background}>
				<div className={styles.headerBackground}>
					<Header />
				</div>
				<StatSection />
				<Footer />
			</div>
		</>
	);
}

export default StatsPage;

import styles from "./Header.module.css";

function Header() {
	return (
		<div className={`${styles.header}`}>
			<h1 className={styles.title}>Pomodoro Timer</h1>
		</div>
	);
}

export default Header;

import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

function Footer() {
	return (
		<div className={styles.footer}>
			<a
				href={"https://github.com/Mark5013"}
				className={styles.icon}
				data-testid="github-icon">
				<FontAwesomeIcon icon={faGithub} />
			</a>
			<a
				href={"https://www.linkedin.com/in/mark5013/"}
				className={styles.icon}
				data-testid="linkedin-icon">
				<FontAwesomeIcon icon={faLinkedin} />
			</a>
		</div>
	);
}

export default Footer;

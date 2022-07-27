import styles from "./ErrorModal.module.css";
import Button from "./Button";

function ErrorModal(props) {
	return (
		<>
			<div
				className={styles.backdrop}
				onClick={props.closeErrorModal}></div>
			<div className={styles.errorModal}>
				<div className={styles.errorText}>
					<p>{props.errorText}</p>
				</div>
				<div className={styles.errorButtons}>
					<Button
						type="button"
						text="Close"
						onClick={props.closeErrorModal}
					/>
				</div>
			</div>
		</>
	);
}

export default ErrorModal;

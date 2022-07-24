import styles from "./Button.module.css";

function Button(props) {
	return (
		<button
			onClick={props.onClick}
			className={`${styles.btn} ${styles[props.style]}`}
			type={props.type}>
			{props.text}
		</button>
	);
}

export default Button;

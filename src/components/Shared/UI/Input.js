import styles from "./Input.module.css";

function Input(props) {
	return (
		<input
			type={props.type}
			id={props.id}
			placeholder={props.placeholder}
			className={`${styles.taskFormInput} ${styles[props.style]}`}
			onChange={props.onChange}
		/>
	);
}

export default Input;

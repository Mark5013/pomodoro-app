import styles from "./GeneralCard.module.css";

function GeneralCard(props) {
	return <div className={styles[props.cardType]}>{props.children}</div>;
}

export default GeneralCard;

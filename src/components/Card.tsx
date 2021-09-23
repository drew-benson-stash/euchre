import { Card as CardModel, cardToFileName } from '../game/card-models';
import styles from "./Card.module.css";

export interface CardProps {
	card: CardModel,
	onClick?: () => void,
	disabled?: boolean,
}

export function Card(props: CardProps) {
	if (!props.card) {
		return null;
	}

	const cardFileName = cardToFileName(props.card);

	return (
		<div className={styles.card + (props.disabled ? ` ${styles.cardDisabled}` : '')}>
			<img
				className={styles.cardImage}
				src={`cards/${cardFileName}`}
				onClick={props.onClick}
			></img>
		</div>
	);
}

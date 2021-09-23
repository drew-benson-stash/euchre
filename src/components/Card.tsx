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
		<img
			src={`cards/${cardFileName}`}
			className={styles.card}
			onClick={props.onClick}
			
		>
			
		</img>
	);
}

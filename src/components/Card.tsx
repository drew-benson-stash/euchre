import { Card as CardModel, cardName, cardToFileName } from '../game/card-models';
import styles from "./Card.module.css";

export interface CardProps {
	card: CardModel,
	onClick?: () => void,
	disabled?: boolean,
	// floating-point number between 0 and 1.0 
	place?: number,
	splay?: boolean,
}

export const defaultCardProps = {
	onClick: () => {},
	disabled: false,
	place: 0.5, // middle,
	splay: true,
}

export function Card(props: CardProps) {
	if (!props.card) return null;

	const p: Required<CardProps> = {...defaultCardProps, ...props};

	const cardFileName = cardToFileName(p.card);

	const leftAndRight = (2 * p.place) - 1;
	const upAndDown = Math.abs(2 * p.place - 1) * -1 + 1;

	const cardStyle = {
		transform: p.splay ? `rotate(${16 * leftAndRight}deg) translate(0, ${-16 * upAndDown}px)` : 'none',
	}

	return (
		<div className={styles.card + (p.disabled ? ` ${styles.cardDisabled}` : '')}>
			<img
				alt={cardName(p.card)}
				style={cardStyle}
				className={styles.cardImage}
				src={`cards/${cardFileName}`}
				onClick={p.onClick}
			></img>
		</div>
	);
}

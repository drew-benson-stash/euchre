import { Card as CardModel, CardFace, cardName, CardSuit, cardToImage, newCard } from '../game/card-models';
import styles from "./Card.module.css";

export interface CardProps {
	readonly card?: CardModel,
	readonly onClick?: () => void,
	readonly disabled?: boolean,
	readonly grayedOut?: boolean,
	// floating-point number between 0 and 1.0 
	readonly place?: number,
	readonly splay?: boolean,
}

export const defaultCardProps = {
	card: newCard(CardSuit.SPADES, CardFace.JOKER),
	onClick: () => {},
	disabled: false,
	grayedOut: false,
	place: 0.5, // middle,
	splay: false,
}

export function Card(props: CardProps) {
	if (!props.card) return null;

	const p: Required<CardProps> = {...defaultCardProps, ...props};

	const cardFileName = cardToImage(p.card);

	const leftAndRight = (2 * p.place) - 1;
	const upAndDown = Math.abs(2 * p.place - 1) * -1 + 1;

	const cardStyle = {
		transform: p.splay ? `rotate(${16 * leftAndRight}deg) translate(0, ${-16 * upAndDown}px)` : 'none',
	}

	const style = [
		styles.card,
		p.disabled ? styles.disabled : null,
		p.grayedOut ? styles.grayedOut : null,
	];

	const classes = style.filter(s => s).join(' ');

	return (
		<div className={classes}>
			<img
				alt={cardName(p.card)}
				style={cardStyle}
				className={styles.image}
				src={`${cardFileName}`}
				onClick={p.disabled ? () => {} : p.onClick}
			></img>
		</div>
	);
}

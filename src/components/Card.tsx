import { Card as CardModel, CardFace, cardName, CardSuit, newCard } from '../game/card-models';
import styles from "./Card.module.css";

export function cardToFileName(card: CardModel): string {
	return `images/cards/${String(card.value)}_of_${card.suit}.svg`.toLowerCase();
}

export interface CardProps {
	readonly card?: CardModel,
	readonly onClick?: () => void,
	readonly disabled?: boolean,
	// floating-point number between 0 and 1.0 
	readonly place?: number,
	readonly splay?: boolean,
}

export const defaultCardProps = {
	card: newCard(CardSuit.SPADES, CardFace.JOKER),
	onClick: () => {},
	disabled: false,
	place: 0.5, // middle,
	splay: false,
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
				src={`${cardFileName}`}
				onClick={p.onClick}
			></img>
		</div>
	);
}

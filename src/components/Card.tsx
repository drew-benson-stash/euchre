import { Card as CardModel, cardName } from '../game/card-models';

export interface CardProps {
	card: CardModel,
	onClick?: () => void,
}

export function Card(props: CardProps) {
	if (!props.card) {
		return null;
	}

	return (
		<button
			onClick={props.onClick}
		>
			{cardName(props.card)}
		</button>
	);
}

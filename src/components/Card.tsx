import { Card as CardModel, cardName } from '../game/card-models';

export interface CardProps {
	card: CardModel,
	onClick?: () => void,
	disabled?: boolean,
}

export function Card(props: CardProps) {
	if (!props.card) {
		return null;
	}

	return (
		<button
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{cardName(props.card)}
		</button>
	);
}

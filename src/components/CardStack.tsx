import { Card as CardModel, Cards } from "../game/card-models";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface CardStackProps {
	cards: Cards;
	onCardClick?: (card: CardModel) => void;
	disabled?: boolean;
	disableCard?: Array<boolean>;
	splay?: boolean;
}

const CardStackPropDefaults: Required<CardStackProps> = {
	cards: [],
	onCardClick: () => {},
	disabled: false,
	disableCard: [],
	splay: true,
}

export function CardStack(props: CardStackProps) {
	const p: Required<CardStackProps> = {...CardStackPropDefaults, ...props};

	const interval = 1.0 / (p.cards.length - 1);

	return (
		<div className={styles.hand}>
			{p.cards?.map((card, i) =>
				<Card
					key={card.suit + card.value}
					card={card}
					place={i * interval}
					onClick={() => p.onCardClick(card)}
					disabled={p.disabled || p.disableCard[i]}
					splay={p.splay}
				></Card>
			)}
		</div>
	);
}

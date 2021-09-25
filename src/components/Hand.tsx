import { Card as CardModel, Cards } from "../game/card-models";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface HandProps {
	readonly cards: Cards;
	readonly onCardClick?: (card: CardModel) => void;
	readonly disabled?: boolean;
	readonly disableCard?: Array<boolean>;
	readonly splay?: boolean;
}

const handPropDefaults: Required<HandProps> = {
	cards: [],
	onCardClick: () => {},
	disabled: false,
	disableCard: [],
	splay: true,
}

export function Hand(props: HandProps) {
	const p: Required<HandProps> = {...handPropDefaults, ...props};

	const interval = 1.0 / (p.cards.length - 1);

	return (
		<div className={styles.hand}>
			{p.cards?.map((card, i) => {
				const disabled = p.disabled || p.disableCard[i];
				return (<Card
					key={card.suit + card.value}
					card={card}
					place={i * interval}
					onClick={() => p.onCardClick(card)}
					disabled={disabled}
					grayedOut={disabled}
					splay={p.cards.length > 1 && p.splay}
				></Card>);
			})}
		</div>
	);
}

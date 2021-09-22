import { Card as CardModel, Cards } from "../game/card-models";
import { Player } from "../game/game-state";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface HandProps {
	player: Player,
	cards: Cards,
	onCardClick: (card: CardModel) => void;
}

export function Hand(props: HandProps) {
	const cardClickHandler = (card: CardModel) => props.onCardClick(card);

	return (
		<div className={styles.hand}>
			<h3>{props.player.name}</h3>
			{props.cards.map((card) =>
				<Card
					key={card.suit + card.value}
					card={card}
					onClick={() => cardClickHandler(card)}
				></Card>
			)}
		</div>
	);
}

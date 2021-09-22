import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card as CardModel } from "../game/card-models";
import { dealerDiscardAndPickup, playCard } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface HandProps {
	playerIndex: number;
}

export function Hand(props: HandProps) {
	const game = useAppSelector(state => state.game);
	const player = game.players[props.playerIndex];
	const cards = game.table?.hands[player.index];

	const dispatch = useAppDispatch();

	const cardClickHandler = (card: CardModel) => {
		if (game.phase === GamePhase.PLAY_HAND) {
			dispatch(playCard(card));
		}
		if (props.playerIndex === game.dealer && game.phase === GamePhase.DEALER_DISCARD) {
			dispatch(dealerDiscardAndPickup(card));
		}
	};

	return (
		<div className={styles.hand}>
			<h3>{player.name}</h3>
			{cards?.map((card) =>
				<Card
					key={card.suit + card.value}
					card={card}
					onClick={() => cardClickHandler(card)}
				></Card>
			)}
		</div>
	);
}

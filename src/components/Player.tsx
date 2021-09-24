import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card, CardSuit } from "../game/card-models";
import { callTrump, dealerDiscardAndPickup, orderUpCard, passBid, playCard } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { CardStack } from "./CardStack";
import styles from "./Player.module.css";
import { MiniStack } from "./MiniStack";

export interface PlayerProps {
	playerIndex: number;
}

export function Player(props: PlayerProps) {
	const pi = props.playerIndex;
	const game = useAppSelector(state => state.game);

	const phase = game.phase;
	const player = game.players[pi];
	const hand = game.table.hands[pi] || [];
	const tricks = game.table.tricks[pi] || [];

	const isDealer = game.dealer === pi;
	const isCurrent = game.currentPlayer === pi;

	// TODO:
	const showDeal = true;
	const showPassBid = isCurrent && (phase === GamePhase.BID1 || (!isDealer && phase === GamePhase.BID2));
	const showOrderUp = isCurrent && phase === GamePhase.BID1;
	const showCallTrump = isCurrent && phase === GamePhase.BID2;

	const canPlayCard = isCurrent && phase === GamePhase.PLAY_HAND;
	const dealerDiscard = isDealer && phase === GamePhase.DEALER_DISCARD;

	const dispatch = useAppDispatch();

	const cardClickHandler = (card: Card) => {
		if (canPlayCard) {
			dispatch(playCard(card));
		}
		if (dealerDiscard) {
			dispatch(dealerDiscardAndPickup(card));
		}
	};

	const passBidButton = () =>
		<button onClick={() => dispatch(passBid())}>
			Pass
		</button>

	const orderUpButton = () => 
		<button onClick={() => dispatch(orderUpCard())}>
			{isDealer ? "Pick up" : "Order up"}
		</button>

	const callTrumpButtons = () =>
		<div className={styles.suitButtons}>
			{Object.keys(CardSuit).map(suit => 
				<button onClick={() => dispatch(callTrump(suit as CardSuit))}>
					{suit}
				</button>
			)}
		</div>

	return (
		<div className={styles.player}>
			<CardStack
				cards={hand}
				disabled={!(canPlayCard || dealerDiscard)}
				onCardClick={cardClickHandler}
			></CardStack>

			<div className={styles.playerLabel}>
				{isDealer ? <img className={styles.dealerIcon} alt="Dealer Icon" src="images/dealer_hand.png"></img> : null}
				<span className={styles.playerName}>
					{player.name}
				</span>
			</div>

			<div className={styles.playerActions}>
				{showPassBid ? passBidButton() : null}
				{showOrderUp ? orderUpButton() : null}
				{showCallTrump ? callTrumpButtons() : null}
			</div>

			{tricks.map((trick, i) => <MiniStack key={i} cards={trick.map(t => t.card)}></MiniStack>)}

		</div>
	);
}

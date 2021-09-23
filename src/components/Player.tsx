import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CardSuit } from "../game/card-models";
import { callTrump, orderUpCard, passBid } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Hand } from "./Hand";
import styles from "./Player.module.css";

export interface PlayerProps {
	playerIndex: number;
}

export function Player(props: PlayerProps) {
	const pi = props.playerIndex;
	const game = useAppSelector(state => state.game);

	const phase = game.phase;
	const player = game.players[pi];
	const hand = game.table?.hands[pi];
	const isDealer = game.dealer === pi;
	const isCurrent = game.currentPlayer === pi;

	const dispatch = useAppDispatch();

	const showPassBid = isCurrent && (phase === GamePhase.BID1 || (!isDealer && phase === GamePhase.BID2));
	const showOrderUp = isCurrent && phase === GamePhase.BID1;
	const showCallTrump = isCurrent && phase === GamePhase.BID2;

	const passBidButton = () =>
		<button onClick={() => dispatch(passBid())}>
			Pass
		</button>

	const orderUpButton = () => 
		<button onClick={() => dispatch(orderUpCard())}>
			OrderUp
		</button>

	const callTrumpButtons = () =>
		Object.keys(CardSuit).map(suit => 
			<button onClick={() => dispatch(callTrump(suit as CardSuit))}>
				{suit}
			</button>
		);

	return (
		<div>
			<span className={styles.playerName}>{player.name}</span>
			<span className={styles.dealerLabel}>
				{isDealer ? <span> (Dealer)</span> : null}
			</span>
			{/* {isCurrent ? <span>{"<-"}</span> : null} */}

			{showPassBid ? passBidButton() : null}
			{showOrderUp ? orderUpButton() : null}
			{showCallTrump ? callTrumpButtons() : null}

			{hand ? <Hand playerIndex={pi}></Hand> : null}
		</div>
	);
}

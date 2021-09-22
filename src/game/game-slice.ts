import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { RootState } from "../app/store";
import { Card, Cards, CardSuit, removeCard, shuffle } from "./card-models";
import { deal as dealCards, deck as newDeck, leftOfPlayer, rightOfPlayer, randomPlayer, winningPlayer, scoreHand, addScores, gameOver, handOver } from "./game-rules";
import { GamePhase, GameState, initialState, TableState, Team } from "./game-state";

export function addPlayersReducer(state: WritableDraft<GameState>, action: PayloadAction<Array<string>>): void {
	if (action.payload.length !== 4) {
		throw new Error("Must supply exactly 4 players");
	}
	const players = action.payload;
	state.players = [
		{index: 0, name: players[0], team: Team.A},
		{index: 1, name: players[1], team: Team.B},
		{index: 2, name: players[2], team: Team.A},
		{index: 3, name: players[3], team: Team.B},
	];
	state.dealer = randomPlayer();
	state.phase = GamePhase.DEAL;
}

export function dealReducer(state: WritableDraft<GameState>): void {
	state.dealer = leftOfPlayer(state.dealer);
	const deck = shuffle(newDeck);
	const table = dealCards(deck, state.dealer);
	state.table = table as WritableDraft<TableState>;
	state.currentPlayer = leftOfPlayer(state.dealer);
	state.phase = GamePhase.BID1;
}

export function passBidReducer(state: WritableDraft<GameState>): void {
	if (state.currentPlayer === state.dealer) {
		// If state is BID2, "stick the dealer" - play cannot continue until dealer calls trump
		if (state.phase === GamePhase.BID1) {
			state.phase = GamePhase.BID2;
		}
	}

	state.currentPlayer = leftOfPlayer(state.currentPlayer);
}

export function orderUpCardReducer(state: WritableDraft<GameState>): void {
	state.trump = state.table.upCard!.suit;
	state.maker = state.currentPlayer;

	state.phase = GamePhase.DEALER_DISCARD;
}

export function callTrumpReducer(state: WritableDraft<GameState>, action: PayloadAction<CardSuit>): void {

	const suit = action.payload;
	// Validate that suit is not same as upcard
	state.trump = suit;
	state.maker = state.currentPlayer;

	state.phase = GamePhase.PLAY_HAND;

	state.currentPlayer = leftOfPlayer(state.dealer);
	state.startPlayer = state.currentPlayer;
}

export function dealerDiscardAndPickupReducer(state: WritableDraft<GameState>, action: PayloadAction<Card>): void {
	if (!state.table) throw new Error("Table must be populated");

	const discard = action.payload;

	// Add upcard to dealer's hand
	const dealerHand = [...state.table.hands[state.dealer], state.table.upCard!];
	state.table.upCard = undefined;

	// Remove discard and add to the kitty
	state.table.hands[state.dealer] = removeCard(dealerHand, discard) as WritableDraft<Cards>;
	state.table.kitty = [...state.table?.kitty, discard];

	state.phase = GamePhase.PLAY_HAND;

	state.currentPlayer = leftOfPlayer(state.dealer);
	state.startPlayer = state.currentPlayer;
}

export function playCardReducer(state: WritableDraft<GameState>, action: PayloadAction<Card>): void {
	const card = action.payload;

	// TODO: renege test?

	state.table.plays.push({
		player: state.currentPlayer,
		card,
	});
	
	state.table.hands[state.currentPlayer] = removeCard(state.table.hands[state.currentPlayer], card) as WritableDraft<Cards>;

	if (state.currentPlayer === rightOfPlayer(state.startPlayer!)) {
		// End of trick - score plays
		const winner = winningPlayer(state.table.plays, state.trump!);

		state.table.tricks[winner].push(state.table.plays.map(play => play.card));
		state.table.plays = [];

		if (handOver(state.table.tricks)) {
			// End of hand - score hand
			const scores = scoreHand(state.table.tricks, state.maker!);
			state.scores = addScores(state.scores, scores);

			if (gameOver(state.scores)) {
				state.phase = GamePhase.END;
			}
		}
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		addPlayers: addPlayersReducer,
		deal: dealReducer,
		passBid: passBidReducer,
		orderUpCard: orderUpCardReducer,
		callTrump: callTrumpReducer,
		dealerDiscardAndPickup: dealerDiscardAndPickupReducer,
		playCard: playCardReducer,
	}
});

export const { 
	addPlayers,
	deal,
	passBid,
	orderUpCard,
	callTrump,
	dealerDiscardAndPickup,
	playCard,
} = gameSlice.actions;

export const selectPhase = (state: RootState) => state.game.phase;
export const selectTable = (state: RootState) => state.game.table;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayer = (i: number) => (state: RootState) => state.game.players[i];
export const selectPlayerHand = (i: number) => (state: RootState) => state.game.table?.hands[i];
export const selectIsDealer = (i: number) => (state: RootState) => state.game.dealer === i;
export const selectIsCurrentPlayer = (i: number) => (state: RootState) => state.game.currentPlayer === i;

export default gameSlice.reducer;

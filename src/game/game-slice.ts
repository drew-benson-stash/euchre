import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { RootState } from "../app/store";
import { Card, Cards, CardSuit, removeCard, shuffle } from "./card-models";
import { deal as dealCards, deck as newDeck, leftOfPlayer, rightOfPlayer, randomPlayer, winningPlayer, scoreHand, addScores, gameOver } from "./game-rules";
import { GamePhase, GameState, initialScores, initialState, TableState, Team } from "./game-state";

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
	if (state.currentPlayer === rightOfPlayer(state.dealer)) {
		// If state is BID2, "stick the dealer" - play cannot continue until dealer calls trump
		if (state.phase === GamePhase.BID1) {
			state.phase = GamePhase.BID2;
		}
	}
	state.currentPlayer = leftOfPlayer(state.currentPlayer);
}

export function orderUpCardReducer(state: WritableDraft<GameState>): void {
	// Validate Phase
	state.trump = state.table!.upCard!.suit;
	state.maker = state.currentPlayer;

	state.phase = GamePhase.DEALER_DISCARD;
}

export function callTrumpReducer(state: WritableDraft<GameState>, action: PayloadAction<CardSuit>): void {
	// Validate phase
	const suit = action.payload;
	// Validate that suit is not same as upcard
	state.trump = suit;
	state.maker = state.currentPlayer;

	state.phase = GamePhase.INIT_PLAY;
	state.currentPlayer = leftOfPlayer(state.dealer);
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

	state.phase = GamePhase.INIT_PLAY;
}

export function initPlayReducer(state: WritableDraft<GameState>): void {
	state.currentPlayer = leftOfPlayer(state.dealer);
	state.startPlayer = state.currentPlayer;
	state.plays = [];
	state.discard = [];
	state.round = 0;
	state.taken = initialScores;

	state.phase = GamePhase.PLAY_HAND;
}

export function playCardReducer(state: WritableDraft<GameState>, action: PayloadAction<Card>): void {
	const card = action.payload;

	// TODO: renege test?

	state.plays.push({
		player: state.currentPlayer,
		card,
	});
	
	state.table!.hands[state.currentPlayer] = removeCard(state.table!.hands[state.currentPlayer], card) as WritableDraft<Cards>;

	if (state.currentPlayer === rightOfPlayer(state.startPlayer!)) {
		// End of round - score plays
		const winner = winningPlayer(state.plays, state.trump!);
		const winningTeam = state.players[winner].team;

		state.taken[winningTeam]++;

		// TODO: track rounds by remaining cards instead of round #
		if (state.round < 4) {
			state.round++;
		} else {
			// End of hand - score hand
			const makingTeam = state.players[state.maker!].team;
			const scores = scoreHand(state.taken, makingTeam);
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
		initPlay: initPlayReducer,
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
	initPlay,
	playCard,
} = gameSlice.actions;

export const selectPhase = (state: RootState) => state.game.phase;
export const selectTable = (state: RootState) => state.game.table;
export const selectPlayers = (state: RootState) => state.game.players;

export default gameSlice.reducer;

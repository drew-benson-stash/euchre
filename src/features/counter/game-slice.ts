import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { Card, Cards, CardSuit, removeCard, shuffle } from "../../card-models";
import { deal, deck as newDeck, leftOfPlayer, rightOfPlayer, randomPlayer, winningPlayer, scoreHand, addScores, gameOver } from "../../game-rules";
import { GamePhase, initialScores, initialState, TableState, Team } from "../../game-state";

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		addPlayers: (state, action: PayloadAction<Array<string>>) => {
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
		},
		deal: state => {
			state.dealer = leftOfPlayer(state.dealer);
			const deck = shuffle(newDeck);
			const table = deal(deck, state.dealer);
			state.table = table as WritableDraft<TableState>;
			state.currentPlayer = leftOfPlayer(state.dealer);
			state.phase = GamePhase.BID1;
		}, 
		passBid: state => {
			if (state.currentPlayer === rightOfPlayer(state.dealer)) {
				// If state is BID2, "stick the dealer" - play cannot continue until dealer calls trump
				if (state.phase === GamePhase.BID1) {
					state.phase = GamePhase.BID2;
				}
			}
			state.currentPlayer = leftOfPlayer(state.currentPlayer);
		},
		orderUpCard: state => {
			// Validate Phase
			state.trump = state.table!.upCard!.suit;
			state.maker = state.currentPlayer;

			state.phase = GamePhase.DEALER_DISCARD;
		},
		callTrump: (state, action: PayloadAction<CardSuit>) => {
			// Validate phase
			const suit = action.payload;
			// Validate that suit is not same as upcard
			state.trump = suit;
			state.maker = state.currentPlayer;

			state.phase = GamePhase.INIT_PLAY;
			state.currentPlayer = leftOfPlayer(state.dealer);
		},
		dealerDiscardAndPickup: (state, action: PayloadAction<Card>) => {
			if (!state.table) throw new Error("Table must be populated");

			const discard = action.payload;

			// Add upcard to dealer's hand
			const dealerHand = [...state.table.hands[state.dealer], state.table.upCard!];
			state.table.upCard = undefined;

			// Remove discard and add to the kitty
			state.table.hands[state.dealer] = removeCard(dealerHand, discard) as WritableDraft<Cards>;
			state.table.kitty = [...state.table?.kitty, discard];

			state.phase = GamePhase.INIT_PLAY;
		},
		initPlay: state => {
			state.currentPlayer = leftOfPlayer(state.dealer);
			state.startPlayer = state.currentPlayer;
			state.plays = [];
			state.discard = [];
			state.round = 0;
			state.taken = initialScores;

			state.phase = GamePhase.PLAY_HAND;
		},
		playCard: (state, action: PayloadAction<Card>) => {
			const card = action.payload;

			// TODO: renege test?

			state.plays.push({
				playerIndex: state.currentPlayer,
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
	}
});


import { Card, Cards, CardSuit } from "./card-models";

export enum Team {
	A = "A",
	B = "B",
}

export interface Player {
	readonly index: number;
	readonly name: string;
	readonly team: Team;
}

export interface PlayerAction {
	readonly player: number;
	readonly card: Card;
}

export interface Scores {
	readonly [Team.A]: number;
	readonly [Team.B]: number;
}

export enum GamePhase {
	START = "START", // Initial state
	INIT_GAME = "INIT_GAME", // Initialize players, score, dealer, current player
	DEAL = "DEAL", // Distribute deck to players and kitty
	BID1 = "BID1", // Players may order up card to dealer
	BID2 = "BID2", // Players may choose trump,
	DEALER_DISCARD = "DEALER_DISCARD",
	INIT_PLAY = "INIT_PLAY", // Initialize round, current player
	PLAY_HAND = "PLAY_HAND", // Players choose a card to play until none remain
	SCORE_ROUND = "SCORE_ROUND",
	SCORE_HAND = "SCORE_HAND", // Score hand, if score >= 10 then end
	END = "END", // Final state
}

export interface TableState {
	readonly upCard?: Card;
	readonly kitty: Cards;
	readonly hands: ReadonlyArray<Cards>;
}

export interface GameState {
	readonly phase: GamePhase;

	readonly players: ReadonlyArray<Player>;
	readonly dealer: number;
	readonly currentPlayer: number; //offset from dealer (i.e. dealer = 0, left of dealer = 1 ...)

	readonly table?: TableState;
	readonly trump?: CardSuit;
	readonly maker?: number;
	readonly startPlayer?: number;
	readonly round: number; // 0-4
	readonly discard: Cards;

	readonly plays: ReadonlyArray<PlayerAction>;
	readonly taken: Scores;

	readonly scores: Scores;
}

export const initialScores: Scores = {
	[Team.A]: 0,
	[Team.B]: 0,
};

export const emptyHands: ReadonlyArray<Cards> = [
	[], [], [], []
]

export const initialState: GameState = {
	phase: GamePhase.START,
	players: [],
	dealer: 0,
	currentPlayer: 0,
	discard: [],
	plays: [],
	round: 0,
	taken: initialScores,
	scores: initialScores,
};

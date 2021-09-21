import { Card, Cards, CardSuit } from "./card-models";

export enum Team {
	A, B
}

export interface Player {
	readonly name: string;
	readonly team: Team;
}

export interface PlayerState {
	readonly player: Player;
	readonly cards: Cards;
}

export interface PlayerAction {
	readonly player: Player;
	readonly card: Card;
}

export interface Scores {
	readonly [Team.A]: number;
	readonly [Team.B]: number;
}

export enum GamePhase {
	START, // Initial state
	INIT_GAME, // Initialize players, score, dealer, current player
	DEAL, // Distribute deck to players and kitty
	BID1, // Players may order up card to dealer
	BID2, // Players may choose trump
	INIT_PLAY, // Initialize round, current player
	PLAY_HAND, // Players choose a card to play until none remain
	SCORE, // Score hand, if score >= 10 then end
	END, // Final state
}

export interface GameState {
	readonly phase: GamePhase;

	readonly players: ReadonlyArray<Player>;
	readonly dealer: number;
	readonly currentPlayer: number; //offset from dealer (i.e. dealer = 0, left of dealer = 1 ...)

	readonly hands: ReadonlyMap<Player, Cards>;
	readonly upCard?: Card;
	readonly kitty?: Cards;
	readonly trump?: CardSuit;
	readonly maker?: Player;
	readonly round?: number; // 0-4
	readonly discard: Cards;

	readonly plays: ReadonlyArray<PlayerAction>;
	readonly taken: Scores;

	readonly score: Scores;
}

export const initialScores: Scores = {
	[Team.A]: 0,
	[Team.B]: 0,
};

export const intialState: GameState = {
	phase: GamePhase.START,
	players: [],
	dealer: 0,
	currentPlayer: 0,
	hands: new Map(),
	discard: [],
	plays: [],
	taken: initialScores,
	score: initialScores,
};

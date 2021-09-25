import { newCard, Card, CardFace, Cards, CardSuit, CardValue, FaceCard, isFaceCard, sameCard } from "./card-models";
import { initialTableState, Player, PlayerAction, Scores, TableState, Team, Trick } from "./game-state";

const TRUMP_BONUS = 1000;
const LEAD_BONUS = 100;

const WINNING_SCORE = 2;
const TRICKS_PER_HAND = 5;

/**
 * Determines which player won this trick
 * 
 * @param trick list of cards played and by whom
 * @param trump suit that ranks above all others for this hand
 * @returns number of the player who played the winning card this trick
 */
export function winningPlayer(trick: ReadonlyArray<PlayerAction>, trump: CardSuit): number {
	const cards = trick.map(play => play.card);
	const leadCard = trick[0].card;
	// Left bower IS trump suit for the duration of the hand
	const leadSuit = isLeftBower(leadCard, trump) ? trump : leadCard.suit;
	const sorted = cards.sort(compareCards.bind(null, trump, leadSuit));

	// Last card has highest value, thus is the winner!
	const winningCard = sorted[sorted.length - 1];

	const winningPlay = trick.find(play => sameCard(winningCard, play.card));
	return winningPlay!.player;
}

/**
 * Compares the given cards using Euchre rules for trump and lead.
 * Returns +1 if A is the superior card, or -1 if B is superior.
 * 
 * If neither card is trump or lead, results will be based on value comparison alone.
 * This is technically inaccurate since in this condition results are indeterminate but should not matter in use.
 * 
 * @param a card A
 * @param b card B
 * @param trump suit that ranks above all others for this hand
 * @param lead suit of the first card played this trick
 * @returns +1 if A wins, -1 if B wins, 0 if identical or indeterminate (see notes)
 */
export function compareCards(trump: CardSuit, lead: CardSuit, a: Card, b: Card): number {
	const rawScore = cardScore(a, trump, lead) - cardScore(b, trump, lead);
	return Math.sign(rawScore);
}

/**
 * Returns a numeric score that ranks this card compared to other cards.
 * This score is only valid compared to other cards given the same suit and lead.
 * 
 * @param card the card to score
 * @param trump suit that ranks above all others for this hand
 * @param lead suit of the first card played this trick
 * @returns a number that ranks this card compared to other cards given the same suit and lead
 */
export function cardScore(card: Card, trump: CardSuit, lead: CardSuit): number {
	const isTrump = isTrumpCard(card, trump);
	const isLeft = isLeftBower(card, trump);

	const score = isFaceCard(card) ? faceScore(card, isTrump) : card.value as number;

	const leadBonus = (card.suit === lead || (isLeft && lead === trump)) ? LEAD_BONUS : 0;
	const trumpBonus = isTrumpCard(card, trump) ? TRUMP_BONUS : 0;

	// Left bower is scored one less than right bower
	const leftBowerPenalty = isLeft ? -1 : 0;

	return score + trumpBonus + leadBonus + leftBowerPenalty;
}

function faceScore(card: FaceCard, isTrump: boolean): number {
	return isTrump ? faceToNumberTrump[card.value] : faceToNumber[card.value];
}

/**
 * Returns true if given card is the left bower:
 * The Jack of the suit the same color as the trump suit
 * 
 * @param card 
 * @param trump suit that ranks above all others for this hand
 * @returns true if `card` is the left bower
 */
export function isLeftBower(card: Card, trump: CardSuit): boolean {
	return card.value === CardFace.JACK && card.suit === sameColor[trump];
}

/**
 * Returns true if given card is the right bower:
 * The Jack of the same suit as trump
 * 
 * @param card 
 * @param trump suit that ranks above all others for this hand
 * @returns true if `card` is the right bower
 */
export function isRightBower(card: Card, trump: CardSuit): boolean {
	return card.value === CardFace.JACK && card.suit === trump;
}

/**
 * Returns true if the given card belongs to the trump suit.
 * This includes the left bower, which has a different suit but belongs to the trump suit for the hand
 * 
 * @param card 
 * @param trump suit that ranks above all others for this hand
 * @returns true if `card` belongs to the trump suit
 */
export function isTrumpCard(card: Card, trump: CardSuit) {
	return (card.suit === trump) || isLeftBower(card, trump);
}

const faceToNumber: Record<CardFace, number> = {
	[CardFace.JOKER]: 0,
	[CardFace.JACK]: 11,
	[CardFace.QUEEN]: 12,
	[CardFace.KING]: 13,
	[CardFace.ACE]: 14,
}

const faceToNumberTrump: Record<CardFace, number> = {
	[CardFace.JOKER]: 0,
	[CardFace.QUEEN]: 11,
	[CardFace.KING]: 12,
	[CardFace.ACE]: 13,
	// Left bower: 14 (special case)
	[CardFace.JACK]: 15,
}

const sameColor: Record<CardSuit, CardSuit> = {
	[CardSuit.CLUBS]: CardSuit.SPADES,
	[CardSuit.SPADES]: CardSuit.CLUBS,
	[CardSuit.DIAMONDS]: CardSuit.HEARTS,
	[CardSuit.HEARTS]: CardSuit.DIAMONDS,
}

const euchreCards: Array<CardValue> = [9, 10, CardFace.JACK, CardFace.QUEEN, CardFace.KING, CardFace.ACE];

/**
 * Standard Euchre deck of cards: 9, 10, Jack, Queen, King, and Ace of all four suits
 */
export const deck: Cards = Object.keys(CardSuit).flatMap(suit => {
	return euchreCards.map(value => newCard(suit as CardSuit, value));
});

/**
 * Distributes the given deck of 24 cards to four players,
 * with one up card (card up for trump) and the remaining three cards in the kitty.
 * 
 * An effort was made to simulate traditional Euchre deals (3-2-3-2-2-3-2-3)
 * though this doesn't actually matter if the deck is truly random.
 * 
 * Note this function does *not* shuffle the cards,
 * `deck` is dealt in the order given for repeatability
 * 
 * @param deck the cards to deal to the players
 * @param dealer the number of the dealing player
 * @returns a table state containing the four hands, kitty, and up card
 */
export function deal(deck: Cards, dealer: number): TableState {
	if (deck.length !== 24) {
		throw new Error("Deck must contain exactly 24 cards");
	}

	const hands: ReadonlyArray<Cards> = [
		[...deck.slice(0, 3), ...deck.slice(10, 12)],
		[...deck.slice(3, 5), ...deck.slice(12, 15)],
		[...deck.slice(5, 8), ...deck.slice(15, 17)],
		[...deck.slice(8, 10), ...deck.slice(17, 20)],
	];

	return {
		...initialTableState,
		hands,
		upCard: deck[20],
		kitty: deck.slice(21, 24),
	};
}

/**
 * Returns a random player index (0-3)
 *
 * @returns a random player index
 */
export function randomPlayer(): number {
	return Math.floor(Math.random() * 4);
}

/**
 * Returns the index of the player to the "left" of the given player.
 * In game play, this is the player whose turn usually comes *after* the given player.
 * 
 * @param player 
 * @returns index of the player to the "left" of the given player
 */
export function leftOfPlayer(player: number): number {
	return (player + 1) % 4;
}

/**
 * Returns the index of the player to the "right" of the given player.
 * In game play, this is the player whose turn usually comes *before* the given player.
 * 
 * @param player 
 * @returns index of the player to the "right" of the given player
 */
export function rightOfPlayer(player: number): number {
	// Javascript modulo is not well-defined for negative numbers
	return player <= 0 ? 3 : (player - 1);
}

/**
 * Scores a hand of play based on the number of tricks taken by each team
 * 
 * @param taken the number of tricks taken by each team
 * @param maker the team that decided Trump for this hand
 * @returns the scores of each team as a result of this hand
 */
export function scoreHand(tricks: ReadonlyArray<ReadonlyArray<Trick>>, maker: number): Scores {
	const taken = tricks.map(tricks => tricks.length);

	const takenA = taken[0] + taken[2];
	const takenB = taken[1] + taken[3];

	const makingTeam = (maker % 2 === 0) ? Team.A : Team.B;

	return {
		[Team.A]: scoreTeam(takenA, Team.A, makingTeam),
		[Team.B]: scoreTeam(takenB, Team.B, makingTeam),
	}
}

function scoreTeam(taken: number, team: Team, maker: Team): number {
	const isMaker = team === maker;

	return (!isMaker && taken >= 3) ? 2 : // euchre
		(isMaker && taken === 5) ? 2 : // win all
		(isMaker && taken >= 3) ? 1 : // win most
		0; // lose
};

/**
 * Sums the scores of each team
 * 
 * @param a 
 * @param b 
 * @returns Sum of `a` and `b`
 */
export function addScores(a: Scores, b: Scores): Scores {
	return {
		[Team.A]: a[Team.A] + b[Team.A],
		[Team.B]: a[Team.B] + b[Team.B],
	};
}

/**
 * Returns true if either team has achived victory
 * 
 * @param scores the current scores for each team
 * @returns true if one team has achieved victory
 */
export function winner(scores: Scores): Team | null {
	return scores[Team.A] >= WINNING_SCORE ? Team.A :
		scores[Team.B] >= WINNING_SCORE ? Team.B :
		null;
}

/**
 * Returns true if all cards have been played for this hand
 * 
 * @returns true if all cards have been played for this hand
 */
export function handOver(tricks: ReadonlyArray<ReadonlyArray<Trick>>): boolean {
	const tricksTaken = tricks.reduce((count, tricks) => count + tricks.length, 0);
	return tricksTaken >= TRICKS_PER_HAND;
}

export function getWinners(scores: Scores, players: ReadonlyArray<Player>): ReadonlyArray<Player> | null {
	const winningTeam = winner(scores);
	if (winningTeam === Team.A) {
		return [players[0], players[2]];
	} else if (winningTeam === Team.B) {
		return [players[1], players[3]];
	}
	return null;
}

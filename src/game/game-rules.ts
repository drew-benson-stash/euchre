import { Card, CardFace, Cards, CardSuit, CardValue, FaceCard, isFaceCard, sameCard } from "./card-models";
import { initialScores, PlayerAction, Scores, TableState, Team } from "./game-state";

const TRUMP_BONUS = 1000;
const LEAD_BONUS = 100;

const WINNING_SCORE = 10;

export function winningPlayer(plays: ReadonlyArray<PlayerAction>, trump: CardSuit): number {
	const cards = plays.map(play => play.card);
	const lead = plays[0].card.suit;
	const sorted = cards.sort(compareCards.bind(null, trump, lead));
	const winningCard = sorted[0];

	const winningPlay = plays.find(play => sameCard(winningCard, play.card));
	return winningPlay!.playerIndex;
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
 * @param trump current trump suit
 * @param lead suit that was lead this hand
 * @returns +1 if A wins, -1 if B wins, 0 if identical or indeterminate (see notes)
 */
export function compareCards(trump: CardSuit, lead: CardSuit, a: Card, b: Card): number {
	const rawScore = cardScore(a, trump, lead) - cardScore(b, trump, lead);
	return Math.sign(rawScore);
}

function cardScore(card: Card, trump: CardSuit, lead: CardSuit): number {
	const isTrump = isTrumpCard(card, trump);

	const score = isFaceCard(card) ? faceScore(card, isTrump) : card.value as number;

	const leadBonus = (card.suit === lead) ? LEAD_BONUS : 0;
	const trumpBonus = isTrumpCard(card, trump) ? TRUMP_BONUS : 0;

	// Left bower is scored one less than right bower
	const leftBowerPenalty = isLeftBower(card, trump) ? -1 : 0;

	return score + trumpBonus + leadBonus + leftBowerPenalty;
}

function faceScore(card: FaceCard, isTrump: boolean): number {
	return isTrump ? faceToNumberTrump[card.value] : faceToNumber[card.value];
}

export function isLeftBower(card: Card, trump: CardSuit): boolean {
	return card.value === CardFace.JACK && card.suit === sameColor[trump];
}

export function isRightBower(card: Card, trump: CardSuit): boolean {
	return card.value === CardFace.JACK && card.suit === trump;
}

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

export const deck: Cards = Object.keys(CardSuit).flatMap(suit => {
	return euchreCards.map(value => ({value, suit: suit as CardSuit}));
});

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
		hands,
		upCard: deck[20],
		kitty: deck.slice(21, 24),
	};
}

export function randomPlayer(): number {
	return Math.floor(Math.random() * 4);
}

export function leftOfPlayer(playerIndex: number): number {
	return (playerIndex + 1) % 4;
}

export function rightOfPlayer(playerIndex: number): number {
	return (playerIndex - 1) % 4;
}

export function scoreHand(taken: Scores, maker: Team): Scores {
	const winner = taken[Team.A] > taken[Team.B] ? Team.A : Team.B;
	const score = winner === maker ? 1 : 2;
	return {
		...initialScores,
		[winner]: score,
	};
}

export function addScores(a: Scores, b: Scores): Scores {
	return {
		[Team.A]: a[Team.A] + b[Team.A],
		[Team.B]: a[Team.B] + b[Team.B],
	};
}

export function gameOver(scores: Scores): boolean {
	return scores[Team.A] >= WINNING_SCORE || scores[Team.B] >= WINNING_SCORE;
}

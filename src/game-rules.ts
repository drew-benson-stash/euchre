import { Card, CardFace, CardSuit, FaceCard, isFaceCard } from "./card-models";

const TRUMP_BONUS = 1000;
const LEAD_BONUS = 100;

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
export function compareCards(a: Card, b: Card, trump: CardSuit, lead: CardSuit): number {
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

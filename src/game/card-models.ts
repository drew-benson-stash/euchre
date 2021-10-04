export type Cards = ReadonlyArray<Card>;

export enum CardSuit {
	SPADES = "SPADES",
	DIAMONDS = "DIAMONDS",
	CLUBS = "CLUBS",
	HEARTS = "HEARTS",
}

export enum CardFace {
	JACK = "JACK",
	QUEEN = "QUEEN",
	KING = "KING",
	ACE = "ACE",
	JOKER = "JOKER"
}

export type CardNumber = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CardRank = CardNumber | CardFace;

export interface Card {
	readonly suit: CardSuit;
	readonly rank: CardRank;
	readonly code: string;
}

export function newCard(suit: CardSuit, rank: CardRank) {
	return {
		suit,
		rank,
		code: suit[0] + rankToCode(rank),
	};
}

export function codeToCard(code: string) {
	if (code.length < 2 || code.length > 3) throw new Error(`Invalid card code: ${code}`);

	const suit = codeToSuit[code[0]];
	if (!suit) throw new Error(`Invalid suit code: ${code[0]}`);

	const rankCode = code.substring(1);

	const rank: CardRank = safeParseInt(rankCode) as CardNumber || codeToFace[rankCode];

	return newCard(suit, rank);
}

function safeParseInt(str: string): number | false {
	if (isNaN(str as unknown as number)) {
		return false;
	}
	return parseInt(str, 10);
}

const codeToSuit: Record<string, CardSuit> = {
	"S": CardSuit.SPADES,
	"D": CardSuit.DIAMONDS,
	"C": CardSuit.CLUBS,
	"H": CardSuit.HEARTS,
};

const codeToFace: Record<string, CardFace> = {
	"?": CardFace.JOKER,
	"J": CardFace.JACK,
	"Q": CardFace.QUEEN,
	"K": CardFace.KING,
	"A": CardFace.ACE,
}

export function suitToCode(suit: CardSuit): string {
	return suit[0];
}

export function rankToCode(rank: CardRank): string {
	return typeof rank === "number" ? String(rank) : 
		rank === CardFace.JOKER ? "?" :
		rank[0].toUpperCase();
}

export interface FaceCard extends Card {
	rank: CardFace;
}

export function isFaceCard(card: Card): card is FaceCard {
	return card.rank in CardFace;
}

export function cardName(card: Card): string {
	return `${firstCap(String(card.rank))} of ${firstCap(card.suit)}`;
}

function firstCap(str: string): string {
	return str.length < 1 ? '' :
		str[0].toUpperCase() + str.substring(1).toLowerCase();
}

export function sameCard(a: Card, b: Card): boolean {
	return a.suit === b.suit && a.rank === b.rank;
}

export function removeCard(cards: Cards, toRemove: Card): Cards {
	return cards.filter(card => !sameCard(card, toRemove));
}

export const suitToImage: Record<CardSuit, string> = {
	[CardSuit.SPADES]: 'images/suits/spades.svg',
	[CardSuit.DIAMONDS]: 'images/suits/diamonds.svg',
	[CardSuit.CLUBS]: 'images/suits/clubs.svg',
	[CardSuit.HEARTS]: 'images/suits/hearts.svg',
}

export function cardToImage(card: Card): string {
	return `images/cards/${String(card.rank)}_of_${card.suit}.svg`.toLowerCase();
}

export const BACK_OF_CARD_IMAGE = "images/cards/card_back.svg";

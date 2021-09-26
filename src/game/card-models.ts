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

export type CardValue = CardNumber | CardFace;

export interface Card {
	readonly suit: CardSuit;
	readonly value: CardValue;
	readonly key: string;
}

export function newCard(suit: CardSuit, value: CardValue) {
	return {
		suit,
		value,
		key: suit[0] + shortValue(value),
	};
}

export function shortValue(value: CardValue): string {
	return typeof value === "number" ? String(value) : value[0].toUpperCase();
}

export interface FaceCard extends Card {
	value: CardFace;
}

export function isFaceCard(card: Card): card is FaceCard {
	return card.value in CardFace;
}

export function cardName(card: Card): string {
	return `${firstCap(String(card.value))} of ${firstCap(card.suit)}`;
}

function firstCap(str: string): string {
	return str.length < 1 ? '' :
		str[0].toUpperCase() + str.substring(1).toLowerCase();
}

export function sameCard(a: Card, b: Card): boolean {
	return a.suit === b.suit && a.value === b.value;
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
	return `images/cards/${String(card.value)}_of_${card.suit}.svg`.toLowerCase();
}

export const BACK_OF_CARD_IMAGE = "images/cards/card_back.svg";

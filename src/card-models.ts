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

export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CardValue = CardNumber | CardFace;

export interface Card {
	suit: CardSuit;
	value: CardValue;
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

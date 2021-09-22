import { CardFace, cardName, Cards, CardSuit, CardValue, isFaceCard, removeCard, sameCard } from "./card-models";
import { deck } from "./game-rules";

describe("card models", () => {
	describe("isFaceCard", () => {
		it("identifies all face cards", () => {
			for (const face in CardFace) {
				const card = {suit: CardSuit.SPADES, value: face as CardValue};
				expect(isFaceCard(card)).toBeTruthy();
			}
		});
		it("rejects all number cards", () => {
			for (let v = 0; v <= 10; v++) {
				const card = {suit: CardSuit.SPADES, value: v as CardValue};
				expect(isFaceCard(card)).toBeFalsy();
			}
		});
	})
	describe("cardName", () => {
		it("correctly names face card", () => {
			expect(cardName({suit: CardSuit.SPADES, value: CardFace.JACK})).toEqual("Jack of Spades");
		});
		it("correctly names number card", () => {
			expect(cardName({suit: CardSuit.HEARTS, value: 6})).toEqual("6 of Hearts");
		});
	});
	describe("sameCard", () => {
		it ("correctly identifies identical cards", () => {
			expect(sameCard(
				{suit: CardSuit.DIAMONDS, value: CardFace.ACE},
				{suit: CardSuit.DIAMONDS, value: CardFace.ACE},
			)).toBeTruthy();
		});
		it("rejects same suit different value", () => {
			expect(sameCard(
				{suit: CardSuit.CLUBS, value: CardFace.QUEEN},
				{suit: CardSuit.CLUBS, value: CardFace.KING},
			)).toBeFalsy();
		});
		it("rejects same value different suit", () => {
			expect(sameCard(
				{suit: CardSuit.SPADES, value: CardFace.JACK},
				{suit: CardSuit.CLUBS, value: CardFace.JACK},
			)).toBeFalsy();
		});
	});
	describe("remove card", () => {
		it("creates a new array", () => {
			const original = [deck[4], deck[16], deck[9]];
			const result = removeCard(original, deck[16]);
			expect(result).not.toBe(original);
		});
		it("removes requested card", () => {
			const original = [deck[4], deck[16], deck[9]];
			const result = removeCard(original, deck[16]);
			expect(result.length).toBe(2);
		});
		it("handles non-present card", () => {
			const original = [deck[4], deck[16], deck[9]];
			const result = removeCard(original, deck[20]);
			expect(result.length).toBe(3);
		});
		it("handles empty array", () => {
			const original: Cards = [];
			const result = removeCard(original, deck[20]);
			expect(result.length).toBe(0);
		});
	});
});

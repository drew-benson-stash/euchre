import { CardFace, cardName, Cards, CardSuit, CardRank, isFaceCard, removeCard, sameCard, newCard } from "./card-models";
import { deck } from "./game-rules";

describe("card models", () => {
	describe("isFaceCard", () => {
		it("identifies all face cards", () => {
			for (const face in CardFace) {
				const card = newCard(CardSuit.SPADES, face as CardRank);
				expect(isFaceCard(card)).toBeTruthy();
			}
		});
		it("rejects all number cards", () => {
			for (let v = 0; v <= 10; v++) {
				const card = newCard(CardSuit.SPADES, v as CardRank);
				expect(isFaceCard(card)).toBeFalsy();
			}
		});
	})
	describe("cardName", () => {
		it("correctly names face card", () => {
			expect(cardName(newCard(CardSuit.SPADES, CardFace.JACK))).toEqual("Jack of Spades");
		});
		it("correctly names number card", () => {
			expect(cardName(newCard(CardSuit.HEARTS, 6))).toEqual("6 of Hearts");
		});
	});
	describe("sameCard", () => {
		it ("correctly identifies identical cards", () => {
			expect(sameCard(
				newCard(CardSuit.DIAMONDS, CardFace.ACE),
				newCard(CardSuit.DIAMONDS, CardFace.ACE),
			)).toBeTruthy();
		});
		it("rejects same suit different rank", () => {
			expect(sameCard(
				newCard(CardSuit.CLUBS, CardFace.QUEEN),
					newCard(CardSuit.CLUBS, CardFace.KING),
			)).toBeFalsy();
		});
		it("rejects same rank different suit", () => {
			expect(sameCard(
				newCard(CardSuit.SPADES, CardFace.JACK),
				newCard(CardSuit.CLUBS, CardFace.JACK),
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

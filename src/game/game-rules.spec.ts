import { Card, CardFace, Cards, CardSuit, shuffle } from "./card-models";
import { addScores, cardScore, deal, deck, gameOver, handOver, isLeftBower, isRightBower, isTrumpCard, leftOfPlayer, rightOfPlayer, scoreHand, winningPlayer } from "./game-rules";
import { PlayerAction, Team } from "./game-state";

function tricks(...wins: Array<number>): Array<Array<Cards>> {
	return wins.map(w => Array(w));
}

describe("game rules", () => {
	describe("gameOver", () => {
		it("identifies team A win", () => {
			expect(gameOver({
				[Team.A]: 10,
				[Team.B]: 9,
			})).toBeTruthy();
		});
		it("identifies team B win", () => {
			expect(gameOver({
				[Team.A]: 7,
				[Team.B]: 11,
			})).toBeTruthy();
		});
		it("identifies neither win", () => {
			expect(gameOver({
				[Team.A]: 9,
				[Team.B]: 9,
			})).toBeFalsy();
		});
	});
	describe("addScores", () => {
		const a = {
			[Team.A]: 44,
			[Team.B]: 13,
		};
		const b = {
			[Team.A]: 16,
			[Team.B]: 108,
		};
		it("sums scores", () => {
			const result = addScores(a, b);
			expect(result[Team.A]).toEqual(60);
			expect(result[Team.B]).toEqual(121);
		});
		it("returns new object", () => {
			const result = addScores(a, b);
			expect(result).not.toBe(a);
			expect(result).not.toBe(b);
		});
	});
	describe("scoreHand", () => {
		it("Scores team A win", () => {
			const result = scoreHand(tricks(3, 2, 0, 0), 0);
			expect(result[Team.A]).toEqual(1);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team B win", () => {
			const result = scoreHand(tricks(1, 2, 0, 2), 3);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(1);
		});
		it("Scores team A euchre", () => {
			const result = scoreHand(tricks(1, 1, 1, 2), 2);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(2);
		});
		it("Scores team B euchre", () => {
			const result = scoreHand(tricks(0, 0, 4, 1), 1);
			expect(result[Team.A]).toEqual(2);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team A sweep", () => {
			const result = scoreHand(tricks(2, 0, 3, 0), 2);
			expect(result[Team.A]).toEqual(2);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team B sweep", () => {
			const result = scoreHand(tricks(0, 5, 0, 0), 1);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(2);
		});
	});
	describe("rightOfPlayer", () => {
		it("decrements player index", () => {
			expect(rightOfPlayer(2)).toBe(1);
		});
		it("wraps around at 0", () => {
			expect(rightOfPlayer(0)).toBe(3);
		});
	});
	describe("leftOfPlayer", () => {
		it("increments player index", () => {
			expect(leftOfPlayer(1)).toBe(2);
		});
		it("wraps around at 3", () => {
			expect(leftOfPlayer(3)).toBe(0);
		});
	});
	describe("deal", () => {
		// We're not going to test the full order of deal because, frankly, it doesn't matter.
		it("deals every card", () => {
			const table = deal(shuffle(deck), 0);
			const all = [
				...table.hands[0],
				...table.hands[1],
				...table.hands[2],
				...table.hands[3],
				table.upCard,
				...table.kitty,
			];

			expect(all.length).toEqual(deck.length);
		});
		it("deals every card exactly once", () => {
			const table = deal(shuffle(deck), 0);
			const all = [
				...table.hands[0],
				...table.hands[1],
				...table.hands[2],
				...table.hands[3],
				table.upCard,
				...table.kitty,
			] as Cards;

			const strings = all.map(card => card?.suit + card.value);

			strings.sort();

			// Any duplicate cards should sort adjacent
			for (let i = 1; i < strings.length; i++) {
				expect(strings[i]).not.toEqual(strings[i - 1]);
			}
		});
	});
	describe("cards", () => {
		it("creates a deck of 24 cards", () => {
			expect(deck.length).toEqual(24);
		});
		it("creates no duplicates", () => {
			const strings = deck.map(card => card?.suit + card.value);

			strings.sort();

			// Any duplicate cards should sort adjacent
			for (let i = 1; i < strings.length; i++) {
				expect(strings[i]).not.toEqual(strings[i - 1]);
			}
		});
	});
	describe("isTrumpCard", () => {
		it("identifies trump card", () => {
			expect(isTrumpCard({suit: CardSuit.SPADES, value: 6}, CardSuit.SPADES)).toBeTruthy();
		});
		it("identifies left bower", () => {
			expect(isTrumpCard({suit: CardSuit.SPADES, value: CardFace.JACK}, CardSuit.CLUBS)).toBeTruthy();
		});
		it("rejects non-trump jack", () => {
			expect(isTrumpCard({suit: CardSuit.CLUBS, value: CardFace.JACK}, CardSuit.DIAMONDS)).toBeFalsy();
		});
	});
	describe("isRightBower", () => {
		it("identifies right bower", () => {
			expect(isRightBower({suit: CardSuit.SPADES, value: CardFace.JACK}, CardSuit.SPADES)).toBeTruthy();
		});
		it("rejects left bower", () => {
			expect(isRightBower({suit: CardSuit.SPADES, value: CardFace.JACK}, CardSuit.CLUBS)).toBeFalsy();
		});
		it("rejects non bower", () => {
			expect(isRightBower({suit: CardSuit.HEARTS, value: CardFace.ACE}, CardSuit.HEARTS)).toBeFalsy();
		});
	});
	describe("isLeftBower", () => {
		it("identifies left bower of Spades", () => {
			expect(isLeftBower({suit: CardSuit.CLUBS, value: CardFace.JACK}, CardSuit.SPADES)).toBeTruthy();
		});
		it("identifies left bower of Diamonds", () => {
			expect(isLeftBower({suit: CardSuit.HEARTS, value: CardFace.JACK}, CardSuit.DIAMONDS)).toBeTruthy();
		});
		it("identifies left bower of Clubs", () => {
			expect(isLeftBower({suit: CardSuit.SPADES, value: CardFace.JACK}, CardSuit.CLUBS)).toBeTruthy();
		});
		it("identifies left bower of Hearts", () => {
			expect(isLeftBower({suit: CardSuit.DIAMONDS, value: CardFace.JACK}, CardSuit.HEARTS)).toBeTruthy();
		});
		it("rejects right bower", () => {
			expect(isLeftBower({suit: CardSuit.DIAMONDS, value: CardFace.JACK}, CardSuit.DIAMONDS)).toBeFalsy();
		});
		it("rejects non bower", () => {
			expect(isLeftBower({suit: CardSuit.CLUBS, value: CardFace.ACE}, CardSuit.CLUBS)).toBeFalsy();
		});
	});
	describe("cardScore", () => {
		it("scores non-trump non-lead number card", () => {
			const card: Card = {
				suit: CardSuit.SPADES,
				value: 9
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.HEARTS);

			expect(score).toEqual(card.value);
		});
		it("scores non-trump lead number card", () => {
			const card: Card = {
				suit: CardSuit.SPADES,
				value: 8
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.SPADES);

			expect(score).toEqual(card.value as number + 100);
		});
		it("scores trump lead number card", () => {
			const card: Card = {
				suit: CardSuit.SPADES,
				value: 7
			};

			const score = cardScore(card, CardSuit.SPADES, CardSuit.SPADES);

			expect(score).toEqual(card.value as number + 100 + 1000);
		});
		it("scores trump non-lead number card", () => {
			const card: Card = {
				suit: CardSuit.SPADES,
				value: 6
			};

			const score = cardScore(card, CardSuit.SPADES, CardSuit.CLUBS);

			expect(score).toEqual(card.value as number + 1000);
		});
		it("scores non-trump non-lead face card", () => {
			const card: Card = {
				suit: CardSuit.SPADES,
				value: CardFace.QUEEN
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.HEARTS);

			expect(score).toEqual(12);
		});
		it("scores non-trump lead face card", () => {
			const card: Card = {
				suit: CardSuit.HEARTS,
				value: CardFace.KING
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.HEARTS);

			expect(score).toEqual(13 + 100);
		});
		it("scores trump lead face card", () => {
			const card: Card = {
				suit: CardSuit.CLUBS,
				value: CardFace.ACE
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.CLUBS);

			expect(score).toEqual(13 + 100 + 1000);
		});
		it("scores trump non-lead face card", () => {
			const card: Card = {
				suit: CardSuit.DIAMONDS,
				value: CardFace.QUEEN
			};

			const score = cardScore(card, CardSuit.DIAMONDS, CardSuit.SPADES);

			expect(score).toEqual(11 + 1000);
		});
		it("scores left bower", () => {
			const card: Card = {
				suit: CardSuit.HEARTS,
				value: CardFace.JACK
			};

			const score = cardScore(card, CardSuit.DIAMONDS, CardSuit.SPADES);

			expect(score).toEqual(14 + 1000);
		});
		it("scores right bower", () => {
			const card: Card = {
				suit: CardSuit.CLUBS,
				value: CardFace.JACK
			};

			const score = cardScore(card, CardSuit.CLUBS, CardSuit.SPADES);

			expect(score).toEqual(15 + 1000);
		});
	});
	describe("winningPlayer", () => {
		it("right bower wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.CLUBS, value: CardFace.JACK},},
				{player: 3, card: {suit: CardSuit.HEARTS, value: CardFace.JACK},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.JACK},},
				{player: 1, card: {suit: CardSuit.SPADES, value: CardFace.JACK},},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(0);
		});
		it("left bower wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.CLUBS, value: CardFace.JACK},},
				{player: 3, card: {suit: CardSuit.HEARTS, value: CardFace.JACK},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.ACE},},
				{player: 1, card: {suit: CardSuit.SPADES, value: CardFace.JACK},},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(3);
		});
		it("Low trump wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.CLUBS, value: CardFace.ACE},},
				{player: 3, card: {suit: CardSuit.HEARTS, value: CardFace.ACE},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.ACE},},
				{player: 1, card: {suit: CardSuit.SPADES, value: 9},},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(1);
		});
		it("Low lead wins (no trump)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.CLUBS, value: 9},},
				{player: 3, card: {suit: CardSuit.HEARTS, value: CardFace.ACE},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.ACE},},
				{player: 1, card: {suit: CardSuit.DIAMONDS, value: CardFace.KING},},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(2);
		});
		it("Second-lowest lead wins (no trump)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.CLUBS, value: 9},},
				{player: 3, card: {suit: CardSuit.HEARTS, value: CardFace.ACE},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.ACE},},
				{player: 1, card: {suit: CardSuit.CLUBS, value: 10},},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(1);
		});
		it("Lead ace wins (no trump)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: {suit: CardSuit.DIAMONDS, value: 9},},
				{player: 3, card: {suit: CardSuit.DIAMONDS, value: CardFace.KING},},
				{player: 0, card: {suit: CardSuit.DIAMONDS, value: CardFace.ACE},},
				{player: 1, card: {suit: CardSuit.DIAMONDS, value: CardFace.QUEEN},},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(0);
		});
	});
	describe("handOver", () => {
		it("returns false if no tricks taken", () => {
			expect(handOver(tricks(0, 0, 0, 0))).toBeFalsy();
		});
		it("returns true if 5 tricks taken by single player", () => {
			expect(handOver(tricks(0, 5, 0, 0))).toBeTruthy();
		});
		it("returns false if one taken by each player", () => {
			expect(handOver(tricks(1, 1, 1, 1))).toBeFalsy();
		});
		it("returns true if five tricks taken total", () => {
			expect(handOver(tricks(1, 2, 2, 0))).toBeTruthy();
		});
	});
});

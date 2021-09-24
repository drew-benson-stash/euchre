import { nFromArray, oneFromArray, shuffle } from "./array-utils";

describe("array utils", () => {
	describe("shuffle", () => {
		// There's only so much that I can do to test this without monkeypatching Math.random
		it("works with empty array", () => {
			const result = shuffle([]);
			expect(result.length).toBe(0);
		});
		it("returns all the items given", () => {
			const array = ["A", "B", "C", "D", "E"];
			const result = oneFromArray(array);
			expect(result.length).toBe(array.length);
			array.forEach(el => expect(result.includes(el)));
		});
	});
	describe("oneFromArray", () => {
		it("empty array", () => {
			expect(() => oneFromArray([])).toThrowError();
		});
		it("removes the only item", () => {
			const result = oneFromArray(["A"]);
			expect(result[0]).toBe("A");
			expect(result[1].length).toBe(0);
		});
		it("removes one from three", () => {
			const array = ["A", "B", "C"];
			const [item, remaining] = oneFromArray(array);
			expect(array.includes(item)).toBeTruthy();
			expect(remaining.includes(item)).toBeFalsy();
			expect(remaining.length).toBe(2);
		});
		it("eventually removes all", () => {
			// This isn't a great test. It could fail while working correctly.
			// But it's extremely unlikely and the only other way would be to 
			// re-implement Javascript's random function in a seedable way.

			const array = ["A", "B", "C"];
			const found: Record<string, boolean> = {A: false, B: false, C: false};

			for (let i = 0; i < 1000; i++) {
				const [item] = oneFromArray(array);
				found[item] = true;

				if (Object.values(found).every(f => f)) {
					expect(true).toBeTruthy();
					return;
				}
			}

			throw new Error("Not every item found in 1000 tries: " + JSON.stringify(found));
		});
	});
	describe("nFromArray", () => {
		it("fails if N is too large", () => {
			expect(() => nFromArray(["A", "B"], 3)).toThrowError();
		});
		it("takes zero from an empty array", () => {
			const [items, remaining] = nFromArray([], 0);
			expect(items.length).toBe(0);
			expect(remaining.length).toBe(0);
		});
		it("takes zero from a full array", () => {
			const array = ["A", "B", "C"];
			const [items, remaining] = nFromArray(array, 0);
			expect(items.length).toBe(0);
			expect(remaining.length).toBe(3);
		});
		it("takes one", () => {
			const array = ["A", "B", "C"];
			const [items, remaining] = nFromArray(array, 1);
			expect(items.length).toBe(1);
			expect(array.includes(items[0])).toBeTruthy();
			expect(remaining.includes(items[0])).toBeFalsy();
			expect(remaining.length).toBe(2);
		});
		it("takes two", () => {
			const array = ["A", "B", "C"];
			const [items, remaining] = nFromArray(array, 2);
			expect(items.length).toBe(2);
			expect(remaining.length).toBe(1);
		});
		it("takes all", () => {
			const array = ["A", "B", "C"];
			const [items, remaining] = nFromArray(array, 3);
			expect(items.length).toBe(3);
			expect(remaining.length).toBe(0);
		});
	});
});

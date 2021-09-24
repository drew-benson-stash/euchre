/**
 * Shuffles the elements of the given array and returns a new array
 * 
 * Implementation of the Fisher–Yates algorithm
 * 
 * @param array 
 * @returns 
 */
export function shuffle <T>(array: ReadonlyArray<T>): ReadonlyArray<T> {
	const mutable = array.slice();
	let currentIndex = mutable.length, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
 
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
 
		// And swap it with the current element.
		[mutable[currentIndex], mutable[randomIndex]] = [
		mutable[randomIndex], mutable[currentIndex]];
	}
 
	return mutable;
}

export function oneFromArray<T>(array: ReadonlyArray<T>): [T, Array<T>] {
	if (array.length < 1) throw new Error(`Cannot get item from empty array`);

	const i = Math.floor(Math.random() * array.length);
	const remaining = [...array.slice(0, i), ...array.slice(i + 1)];
	return [array[i], remaining];
}

export function nFromArray<T>(array: Array<T>, n: number): [Array<T>, Array<T>] {
	if (n > array.length) throw new Error(`Cannot get ${n} items from ${array.length} items`);

	if (n <= 0) {
		return [[], array];
	}

	const [one, remaining] = oneFromArray(array);

	const [others, final] = nFromArray(remaining, n - 1);

	return [[one, ...others], final];
}

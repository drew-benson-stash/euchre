

interface RandomUserResponse {
	readonly results: [
		{
			readonly name: {
				readonly first: string,
				readonly last: string,
			}
		}
	]
}

const endpoint = (n: number) => `https://randomuser.me/api/?results=${n}`;

export async function getNames(n: number): Promise<Array<string>> {
	const response = await fetch(endpoint(n));
	const data: RandomUserResponse = await response.json();
	return data.results.map(({name}) => `${name.first} ${name.last}`);
}

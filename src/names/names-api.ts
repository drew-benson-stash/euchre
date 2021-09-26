import { Person } from "../game/game-state";


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

export async function getPeople(n: number): Promise<Array<Person>> {
	const response = await fetch(endpoint(n));
	const data: RandomUserResponse = await response.json();
	return data.results.map(({name}) => ({firstName: name.first, lastName: name.last}));
}

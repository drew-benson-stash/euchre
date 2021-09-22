import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card } from "../game/card-models";
import { addPlayers, deal, selectPlayers, selectTable } from "../game/game-slice";
import { Table } from "./Table";

export function Game() {
	const table = useAppSelector(selectTable);
	const players = useAppSelector(selectPlayers);
	const phase = useAppSelector(state => state.game.phase);


	const dispatch = useAppDispatch();

	const handCardClickHandler = (player: number, card: Card): void => {console.log(player, card)};
	const playerButtonHandler = () => dispatch(addPlayers(["A", "B", "C", "D"]));
	const dealButtonHandler = () => dispatch(deal());

	if (table) {
		return (
			<div>
				{phase}
				<Table></Table>
			</div>
		)
	} else {
		return (
			<div>
				<button onClick={playerButtonHandler}>Add Players</button>
				{players.map(p => p.name).join(", ")}
				<button onClick={dealButtonHandler}>Deal</button>
			</div>
		)
	}
}

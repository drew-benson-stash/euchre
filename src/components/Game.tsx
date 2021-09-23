import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card } from "../game/card-models";
import { addPlayers, deal, selectPlayers, selectTable } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Table } from "./Table";

export function Game() {
	const table = useAppSelector(selectTable);
	const players = useAppSelector(selectPlayers);
	const phase = useAppSelector(state => state.game.phase);


	const dispatch = useAppDispatch();

	const handCardClickHandler = (player: number, card: Card): void => {console.log(player, card)};
	const playerButtonHandler = () => dispatch(addPlayers(["Anne", "Bob", "Charlie", "Diane"]));
	const dealButtonHandler = () => dispatch(deal());

	if (phase === GamePhase.ADD_PLAYERS) {
		return (
			<div>
				<button onClick={playerButtonHandler}>Add Players</button>
				{players.map(p => p.name).join(", ")}
			</div>
		);
	} else if (phase === GamePhase.DEAL) {
		return <button onClick={dealButtonHandler}>Deal</button>
	} else {
		return (
			<div>
				{phase}
				<Table></Table>
			</div>
		);
	}
}

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addPlayers, selectPlayers } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Table } from "./Table";

export function Game() {

	const players = useAppSelector(selectPlayers);
	const phase = useAppSelector(state => state.game.phase);

	const dispatch = useAppDispatch();

	const playerButtonHandler = () => dispatch(addPlayers(["Anne", "Bob", "Charlie", "Diane"]));

	if (phase === GamePhase.ADD_PLAYERS) {
		return (
			<div>
				<button onClick={playerButtonHandler}>Add Players</button>
				{players.map(p => p.name).join(", ")}
			</div>
		);
	} else {
		return (
			<div>
				<Table></Table>
			</div>
		);
	}
}

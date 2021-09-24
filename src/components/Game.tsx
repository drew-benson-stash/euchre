import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addPlayers, selectPlayers } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { getNames } from "../names/names-api";
import { Table } from "./Table";

export function Game() {

	const players = useAppSelector(selectPlayers);
	const phase = useAppSelector(state => state.game.phase);

	const dispatch = useAppDispatch();

	const playerButtonHandler = async () => {
		const names = await getNames(4);
		dispatch(addPlayers(names));
	}

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

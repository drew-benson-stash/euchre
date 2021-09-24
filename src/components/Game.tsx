import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addPlayers } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { getNames } from "../names/names-api";
import { Table } from "./Table";
import styles from "./Game.module.css";

export function Game() {

	const phase = useAppSelector(state => state.game.phase);

	const dispatch = useAppDispatch();

	const playerButtonHandler = async () => {
		const names = await getNames(4);
		dispatch(addPlayers(names));
	}

	if (phase === GamePhase.ADD_PLAYERS) {
		return (
			<div className={styles.splashScreen} style={{backgroundImage: `url('images/splashscreen.png')`}}>
				<button onClick={playerButtonHandler}>START</button>
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
